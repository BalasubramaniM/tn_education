/**
 * Index file.
 */
"use strict";

let dataSource,
    lang,
    sourceChart = null;

/**
 * Show Progress
 */
const showProgress = () => {
    document.getElementById("progress").style.display = "block";
};

/**
 * Hide Progress
 */
const hideProgress = () => {
    document.getElementById("progress").style.display = "none";
};

const updateDate = date => {
    let updatedDate = new Date(date);
    document.getElementById("last_updated").innerHTML = updatedDate;
};

const updateRRTotal = (rr, total) => {
    let value = `(${rr}/${total})`;
    document.getElementById("RRTotal").innerHTML = value;
};

const updateCount = data => {
    let studentsCount = data.reduce((a, b) => a + b.studentsCount, 0);
    let staffsCount = data.reduce((a, b) => a + b.staffCount, 0);

    let avgStudCountPerStaff = Math.ceil(studentsCount / staffsCount);

    document.getElementById("StudCount").innerHTML = studentsCount;
    document.getElementById("StaffCount").innerHTML = staffsCount;
    document.getElementById("AvgStaffCount").innerHTML = avgStudCountPerStaff;
};

const updateAppTitle = value => {
    document.getElementById("AppTitle").innerHTML = value;
};

const updateLocalization = () => {
    $("body").i18n();
};

const initLocalization = () => {
    lang = localStorage.getItem("locale");

    lang = lang ? lang : "en";
    document.getElementById("Language").value = lang;

    $.i18n()
        .load({
            en: "src/i18n/en.json",
            ta: "src/i18n/ta.json"
        })
        .done(() => {
            $.i18n({
                locale: lang
            });
            localStorage.setItem("locale", lang);
        });
};

/**
 * Initialization.
 * Fetches data and renders chart.
 */
async function init() {
    showProgress();
    const res = await fetch(
        "https://gist.githubusercontent.com/balasubramanim/fc66826974e13e134e33512f9f634d4b/raw"
    );
    const json = await res.json();
    dataSource = json.data;

    dataSource = dataSource.map(val => {
        return {
            [$.i18n("Number of Students")]: Number(val.number_of_students),
            [$.i18n("School Name")]: val.school_name,
            [$.i18n("District")]: $.i18n(val.district),
            [$.i18n("Category of School")]: $.i18n(val.category_of_school),
            [$.i18n("Year of Establishment")]:
                val.yearof_establishment === "NULL"
                    ? "-"
                    : val.yearof_establishment,
            [$.i18n("School Medium")]: $.i18n(val.school_medium),
            [$.i18n("Subjects Offered")]:
                val.subject_offered === "NULL" ? "-" : val.subject_offered,
            [$.i18n("Pincode")]: val.pincode,
            [$.i18n(
                "Number of Differently Abled Students"
            )]: val.number_of_differently_abled_student,
            [$.i18n("Number of Staffs")]: Number(val.number_of_staff),
            [$.i18n("Number of Classrooms")]: val.number_of_classrooms,
            [$.i18n("Availability of Playground")]:
                val.availabilty_of_playground === "NULL"
                    ? "-"
                    : $.i18n(val.availabilty_of_playground),
            [$.i18n("Availability of Eateries")]: $.i18n(
                val.availabilty_of_eateries
            ),
            [$.i18n("Availability of Hospital")]: $.i18n(
                val.availabilty_of_hospital
            ),
            [$.i18n("Number of Restrooms")]: Number(val.number_of_restrooms),
            [$.i18n("Last Updated At")]: new Date(val.modified_date),
            [$.i18n("Status of the Data")]: $.i18n(
                val.status_of_the_data_set_collected
            )
        };
    });

    onSelect(1);
    updateDate(json.updatedAt);
    updateLocalization();
}

const getQuote = value => {
    let studentsCount = dataSource.reduce(
        (a, b) => a + b[$.i18n("Number of Students")],
        0
    );
    let staffsCount = dataSource.reduce(
        (a, b) => a + b[$.i18n("Number of Staffs")],
        0
    );
    let avgStaffCount = Math.ceil(studentsCount / staffsCount);

    let primaryGroup = groupBy(dataSource, $.i18n("Category of School"));
    let primarySchools = primaryGroup[$.i18n("Primary School")].reduce(
        (a, b) => a + b[$.i18n("Number of Students")],
        0
    );

    let schoolsCount = dataSource.length;
    let schoolsWithoutRR = dataSource.filter(
        val => val[$.i18n("Number of Restrooms")] === 0
    ).length;

    let primaryPercent = Math.ceil((primarySchools / studentsCount) * 100);

    let mediumSchools = dataSource.filter(
        val => val[$.i18n("School Medium")] === "English"
    ).length;

    let schoolsWithoutPG = dataSource.filter(
        val => val[$.i18n("Availability of Playground")] === "No"
    ).length;

    let quote;

    switch (value) {
        case 1:
            quote = `There are totally ${studentsCount} students studying in Govt. Schools in TamilNadu with ${staffsCount} teachers.<br /> Approximately, one teacher takes care of ${avgStaffCount} students.`;
            break;
        case 2:
            quote = `Only Primary schools has more number of Students dominating ${primaryPercent}% when compared with others.`;
            break;
        case 3:
            quote = `There are ${schoolsWithoutRR} schools without Toilets out of ${schoolsCount}.`;
            break;
        case 4:
            quote = `There are only ${mediumSchools} Govt. English Medium schools out of 457 in Tamil Nadu.`;
            break;
        case 5:
            quote = `There are ${schoolsWithoutPG} schools without Playground.`;
            break;
        default:
            quote = `There are totally ${studentsCount} students studying in Govt. Schools in TamilNadu with ${staffsCount} teachers.<br /> Approximately, one teacher takes care of ${avgStaffCount} students.`;
            break;
    }

    document.getElementById("DYNQuote").innerHTML = quote;
};

/**
 * Chart Initialization.
 * @param  {Array} data [Array of data of Physical infrastructure facilities in Municipality and Corporation schools in Tamil Nadu]
 */
const initChart = () => {
    return new Promise((resolve, reject) => {
        try {
            let chart = new Taucharts.Chart({
                type: "scatterplot",
                x: $.i18n("District"),
                y: $.i18n("Number of Students"),
                color: $.i18n("District"),
                data: dataSource,
                size: $.i18n("Number of Students"),
                settings: {
                    renderingTimeout: 1000
                },
                plugins: [
                    Taucharts.api.plugins.get("tooltip")(),
                    Taucharts.api.plugins.get("legend")()
                ]
            });
            resolve(chart);
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * GroupBy property
 * @param  {Array}  objectArray [Array of objects to be grouped.]
 * @param  {String} property    [Key to group by.]
 * @return {Object}             [GroupedBy object.]
 */
const groupBy = (objectArray, property) => {
    return objectArray.reduce(function(acc, obj) {
        var key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
};

/**
 * Schools without RestRoom Chart.
 * @return {Object} [RR Chart - Initialized with X and Y axis.]
 */
const initRRChart = () => {
    let total = dataSource.length;
    let mapData = dataSource
        .filter(val => val[$.i18n("Number of Restrooms")] === 0)
        .map(val => {
            return {
                [$.i18n("School Name")]: val[$.i18n("School Name")],
                [$.i18n("District")]: $.i18n(val[$.i18n("District")]),
                [$.i18n("Number of Staffs")]: val[$.i18n("Number of Staffs")],
                [$.i18n("Number of Students")]: val[
                    $.i18n("Number of Students")
                ],
                [$.i18n("Number of Differently Abled Students")]: val[
                    $.i18n("Number of Differently Abled Students")
                ]
            };
        });

    let rr = mapData.length;
    // updateRRTotal(rr, total);

    return new Promise((resolve, reject) => {
        try {
            let chart = new Taucharts.Chart({
                type: "scatterplot",
                x: $.i18n("District"),
                y: $.i18n("Number of Students"),
                color: $.i18n("District"),
                size: $.i18n("Number of Students"),
                data: mapData,
                settings: {
                    renderingTimeout: 1000
                },
                plugins: [
                    Taucharts.api.plugins.get("tooltip")(),
                    Taucharts.api.plugins.get("legend")()
                ]
            });
            resolve(chart);
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * Schools based on Category Chart.
 * @return {Object} [Categorized schools - Initialized with X and Y axis.]
 */
const initCategoryChart = () => {
    let mapObj = groupBy(dataSource, $.i18n("Category of School"));

    let mapData = [];

    for (let key in mapObj) {
        let obj = {
            [$.i18n("Category of School")]: $.i18n(key),
            [$.i18n("Number of Schools")]: mapObj[$.i18n(key)].length,
            [$.i18n("Number of Students")]: mapObj[$.i18n(key)].reduce(
                (a, b) => a + b[$.i18n("Number of Students")],
                0
            ),
            [$.i18n("Number of Staffs")]: mapObj[$.i18n(key)].reduce(
                (a, b) => a + b[$.i18n("Number of Staffs")],
                0
            )
        };
        mapData.push(obj);
    }
    return new Promise((resolve, reject) => {
        try {
            let chart = new Taucharts.Chart({
                type: "bar",
                x: $.i18n("Category of School"),
                y: $.i18n("Number of Schools"),
                color: $.i18n("Category of School"),
                data: mapData,
                settings: {
                    renderingTimeout: 1000
                },
                plugins: [
                    Taucharts.api.plugins.get("tooltip")(),
                    Taucharts.api.plugins.get("legend")()
                ]
            });
            resolve(chart);
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * Schools based on Medium of Instruction Chart.
 * @return {Object} [Medium of Instruction Chart - Initialized with X and Y axis.]
 */
const initMediumChart = () => {
    let mapObj = groupBy(dataSource, $.i18n("School Medium"));

    let mapData = [];

    for (let key in mapObj) {
        let obj = {
            [$.i18n("School Medium")]: $.i18n(key),
            [$.i18n("Number of Schools")]: mapObj[$.i18n(key)].length,
            [$.i18n("Number of Students")]: mapObj[$.i18n(key)].reduce(
                (a, b) => a + b[$.i18n("Number of Students")],
                0
            ),
            [$.i18n("Number of Staffs")]: mapObj[$.i18n(key)].reduce(
                (a, b) => a + b[$.i18n("Number of Staffs")],
                0
            )
        };
        mapData.push(obj);
    }

    return new Promise((resolve, reject) => {
        try {
            let chart = new Taucharts.Chart({
                type: "bar",
                x: $.i18n("School Medium"),
                y: $.i18n("Number of Schools"),
                color: $.i18n("School Medium"),
                data: mapData,
                settings: {
                    renderingTimeout: 1000
                },
                plugins: [
                    Taucharts.api.plugins.get("tooltip")(),
                    Taucharts.api.plugins.get("legend")()
                ]
            });
            resolve(chart);
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * Schools without Playground Chart.
 * @return {Object} [Playground Chart - Initialized with X and Y axis.]
 */
const initPlaygroundChart = data => {
    let mapData = dataSource.map(val => {
        return {
            [$.i18n("School Name")]: val[$.i18n("School Name")],
            [$.i18n("District")]: $.i18n(val[$.i18n("District")]),
            [$.i18n("Number of Students")]: val[$.i18n("Number of Students")],
            [$.i18n("Number of Differently Abled Students")]: val[
                $.i18n("Number of Differently Abled Students")
            ],
            [$.i18n("Availability of Playground")]: val[
                $.i18n("Availability of Playground")
            ],
            [$.i18n("Availability of Eateries")]: val[
                $.i18n("Availability of Eateries")
            ],
            [$.i18n("Availability of Hospital")]: val[
                $.i18n("Availability of Hospital")
            ]
        };
    });

    return new Promise((resolve, reject) => {
        try {
            let chart = new Taucharts.Chart({
                type: "scatterplot",
                x: $.i18n("District"),
                y: $.i18n("Number of Students"),
                color: $.i18n("Availability of Playground"),
                data: mapData,
                settings: {
                    renderingTimeout: 1000
                },
                plugins: [
                    Taucharts.api.plugins.get("tooltip")(),
                    Taucharts.api.plugins.get("legend")()
                ]
            });
            resolve(chart);
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * Change Language and reload the page.
 * @param  {String} language [Language to be set.]
 */
const onSelectLang = language => {
    localStorage.setItem("locale", language);
    location.reload(true); // Remove Cache
};

/**
 * Select various types of Charts.
 * @param  {String} value [Value of chart to be displayed.]
 */
const onSelect = value => {
    showProgress();

    // Destroy previous Chart and its references.
    if (sourceChart !== null) {
        sourceChart.destroy();
    }

    let selectedVal = Number(value);
    let chartObj;

    switch (selectedVal) {
        case 1:
            chartObj = initChart();
            break;
        case 2:
            chartObj = initCategoryChart();
            break;
        case 3:
            chartObj = initRRChart();
            break;
        case 4:
            chartObj = initMediumChart();
            break;
        case 5:
            chartObj = initPlaygroundChart();
            break;
        default:
            chartObj = initChart();
    }

    chartObj
        .then(chart => {
            document.getElementById("PrimaryBar").innerHTML = "";
            chart.renderTo("#PrimaryBar");
            sourceChart = chart;
            getQuote(selectedVal);
            hideProgress();
        })
        .catch(err => console.error(err));
};

/**
 * Service Worker Init.
 */
window.addEventListener("load", async e => {
    await init();

    if ("serviceWorker" in navigator) {
        try {
            navigator.serviceWorker.register("sw.js");
        } catch (err) {
            console.log(err);
        }
    }
});

initLocalization();
