/**
 * Index file.
 */
"use strict";

function TNEducation() {
    const apiURL =
        "https://gist.githubusercontent.com/balasubramanim/fc66826974e13e134e33512f9f634d4b/raw";
    let source,
        chart = null,
        lastUpdated,
        quote = "",
        category = 1,
        locale = "en";

    async function fetchData() {
        const res = await fetch(apiURL);
        const json = await res.json();

        return json;
    }

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
     * Chart Initialization.
     * @param  {Array} data [Array of data of Physical infrastructure facilities in Municipality and Corporation schools in Tamil Nadu]
     */
    const initChart = () => {
        let dataSource = this.getSource();
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
     * Schools based on Category Chart.
     * @return {Object} [Categorized schools - Initialized with X and Y axis.]
     */
    const initCategoryChart = () => {
        let dataSource = this.getSource();
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
     * Schools without RestRoom Chart.
     * @return {Object} [RR Chart - Initialized with X and Y axis.]
     */
    const initRRChart = () => {
        let dataSource = this.getSource();

        let mapData = dataSource
            .filter(val => val[$.i18n("Number of Restrooms")] === 0)
            .map(val => {
                return {
                    [$.i18n("School Name")]: val[$.i18n("School Name")],
                    [$.i18n("District")]: $.i18n(val[$.i18n("District")]),
                    [$.i18n("Number of Staffs")]: val[
                        $.i18n("Number of Staffs")
                    ],
                    [$.i18n("Number of Students")]: val[
                        $.i18n("Number of Students")
                    ],
                    [$.i18n("Number of Differently Abled Students")]: val[
                        $.i18n("Number of Differently Abled Students")
                    ]
                };
            });

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
     * Schools based on Medium of Instruction Chart.
     * @return {Object} [Medium of Instruction Chart - Initialized with X and Y axis.]
     */
    const initMediumChart = () => {
        let dataSource = this.getSource();
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
        let dataSource = this.getSource();
        let mapData = dataSource.map(val => {
            return {
                [$.i18n("School Name")]: val[$.i18n("School Name")],
                [$.i18n("District")]: $.i18n(val[$.i18n("District")]),
                [$.i18n("Number of Students")]: val[
                    $.i18n("Number of Students")
                ],
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

    this.fetchSource = () => {
        return new Promise((resolve, reject) => {
            try {
                fetchData().then(json => {
                    lastUpdated = json.updatedAt;

                    json = json.data.map(val => {
                        return {
                            [$.i18n("Number of Students")]: Number(
                                val.number_of_students
                            ),
                            [$.i18n("School Name")]: val.school_name,
                            [$.i18n("District")]: $.i18n(val.district),
                            [$.i18n("Category of School")]: $.i18n(
                                val.category_of_school
                            ),
                            [$.i18n("Year of Establishment")]:
                                val.yearof_establishment === "NULL"
                                    ? "-"
                                    : val.yearof_establishment,
                            [$.i18n("School Medium")]: $.i18n(
                                val.school_medium
                            ),
                            [$.i18n("Subjects Offered")]:
                                val.subject_offered === "NULL"
                                    ? "-"
                                    : val.subject_offered,
                            [$.i18n("Pincode")]: val.pincode,
                            [$.i18n(
                                "Number of Differently Abled Students"
                            )]: val.number_of_differently_abled_student,
                            [$.i18n("Number of Staffs")]: Number(
                                val.number_of_staff
                            ),
                            [$.i18n(
                                "Number of Classrooms"
                            )]: val.number_of_classrooms,
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
                            [$.i18n("Number of Restrooms")]: Number(
                                val.number_of_restrooms
                            ),
                            [$.i18n("Last Updated At")]: new Date(
                                val.modified_date
                            ),
                            [$.i18n("Status of the Data")]: $.i18n(
                                val.status_of_the_data_set_collected
                            )
                        };
                    });

                    this.setSource(json);
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        });
    };

    this.getLastUpdated = () => {
        return lastUpdated;
    };

    this.setLastUpdated = () => {
        let updatedDate = new Date(this.getLastUpdated());
        document.getElementById("last_updated").innerHTML = updatedDate;
    };

    this.setSource = json => {
        source = json;
    };

    this.getSource = () => {
        return source;
    };

    this.updateLocalization = () => {
        $("body").i18n();
    };

    this.setCategory = value => {
        category = Number(value);
    };

    this.getCategory = () => {
        return category;
    };

    this.setLocale = value => {
        locale = value;
    };

    this.getLocale = () => {
        return locale;
    };

    this.showProgress = () => {
        document.getElementById("progress").style.display = "block";
    };

    this.hideProgress = () => {
        document.getElementById("progress").style.display = "none";
    };

    const getSchoolsWithoutRR = () => {
        let dataSource = this.getSource();

        return dataSource.filter(
            val => val[$.i18n("Number of Restrooms")] === 0
        );
    };

    const getStudentsCount = () => {
        let dataSource = this.getSource();

        return dataSource.reduce(
            (a, b) => a + b[$.i18n("Number of Students")],
            0
        );
    };

    const getSchoolsWithoutPG = () => {
        let dataSource = this.getSource();

        return dataSource.filter(
            val => val[$.i18n("Availability of Playground")] === $.i18n("No")
        );
    };

    const getEngMediumSchools = () => {
        let dataSource = this.getSource();

        return dataSource.filter(
            val => val[$.i18n("School Medium")] === $.i18n("English")
        );
    };

    const getStaffsCount = () => {
        let dataSource = this.getSource();

        return dataSource.reduce(
            (a, b) => a + b[$.i18n("Number of Staffs")],
            0
        );
    };

    const avgStaffCount = () => {
        let avgStaffCount = Math.ceil(getStudentsCount() / getStaffsCount());

        return avgStaffCount;
    };

    const getChart = () => {
        return chart;
    };

    const setDYK = quote => {
        document.getElementById("DYNQuote").innerHTML = quote;
    };

    const getDYK = () => {
        let quote;
        let lang = this.getLocale();
        let category = res.getCategory();
        let dataSource = res.getSource();

        switch (category) {
            case 1:
                if (lang === "en") {
                    quote = `There are totally ${getStudentsCount()} students studying in ${
                        dataSource.length
                    } Govt. Schools in TamilNadu with ${getStaffsCount()} teachers.<br /> Approximately, one teacher takes care of ${avgStaffCount()} students.`;
                } else {
                    quote = `${getStaffsCount()} ஆசிரியர்களுடன், மொத்தம் ${getStudentsCount()} மாணவர்கள், தமிழ்நாட்டிலுள்ள ${
                        dataSource.length
                    } அரசாங்க பள்ளிகளில் படிக்கிறார்கள்.<br /> சராசரியாக ஒரு ஆசிரியர் ${avgStaffCount()} மாணவர்களை கவனித்து கொள்கிறார்.`;
                }
                break;
            case 2:
                if (lang === "en") {
                    quote = `Only Primary schools has more number of Students dominating ${primaryPercent()}% when compared with others.`;
                } else {
                    quote = `மற்ற பள்ளிவகைகளுடன் ஒப்பிடுகையில், ${primaryPercent()} சதவீதத்துடன் முதன்மை பள்ளிகளிலேயே அதிக மாணவர்கள் படிக்கின்றனர்.`;
                }
                break;
            case 3:
                if (lang === "en") {
                    quote = `There are ${
                        getSchoolsWithoutRR().length
                    } schools without Toilets out of ${getStudentsCount()}.`;
                } else {
                    quote = `மொத்தம் உள்ள ${getStudentsCount()} பள்ளிகளில், ${
                        getSchoolsWithoutRR().length
                    } பள்ளிகளில் கழிப்பறைகள் இல்லை.`;
                }
                break;
            case 4:
                if (lang === "en") {
                    quote = `There is only ${
                        getEngMediumSchools().length
                    } Govt. English Medium schools out of ${
                        dataSource.length
                    } in Tamil Nadu.`;
                } else {
                    quote = `தமிழ்நாட்டிலுள்ள ${
                        dataSource.length
                    } அரசுப்பள்ளிகளில், ${
                        getEngMediumSchools().length
                    } பள்ளிகள் மட்டுமே ஆங்கில வழி கற்பித்தல் பள்ளிகளாகும்.`;
                }
                break;
            case 5:
                if (lang === "en") {
                    quote = `There are ${
                        getSchoolsWithoutPG().length
                    } schools without Playground.`;
                } else {
                    quote = `தமிழ்நாட்டிலுள்ள அரசாங்க பள்ளிகளில், விளையாட்டு மைதானம் இல்லாமல் ${
                        getSchoolsWithoutPG().length
                    } பள்ளிகள் உள்ளன.`;
                }
                break;
            default:
                if (lang === "en") {
                    quote = `There are totally ${getStudentsCount()} students studying in ${
                        dataSource.length
                    } Govt. Schools in TamilNadu with ${getStaffsCount()} teachers.<br /> Approximately, one teacher takes care of ${avgStaffCount()} students.`;
                } else {
                    quote = `${getStaffsCount()} ஆசிரியர்களுடன், மொத்தம் ${getStudentsCount()} மாணவர்கள், தமிழ்நாட்டிலுள்ள அரசாங்க பள்ளிகளில் படிக்கிறார்கள்.<br /> சராசரியாக ஒரு ஆசிரியர் ${avgStaffCount()} மாணவர்களை கவனித்து கொள்கிறார்.`;
                }
        }

        return quote;
    };

    const primaryPercent = () => {
        let dataSource = this.getSource();
        let primaryGroup = groupBy(dataSource, $.i18n("Category of School"));
        let primarySchools = primaryGroup[$.i18n("Primary School")].reduce(
            (a, b) => a + b[$.i18n("Number of Students")],
            0
        );

        return Math.ceil((primarySchools / getStudentsCount()) * 100);
    };

    const destroyChart = () => {
        let chart = getChart();

        if (chart !== null) {
            chart.destroy();
        }
    };

    this.initLocalization = () => {
        let lang = localStorage.getItem("locale");
        if (lang) {
            locale = lang;
        }
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

    this.init = () => {
        let promiseChartObj;
        let category = res.getCategory();

        destroyChart();

        switch (category) {
            case 1:
                promiseChartObj = initChart();
                break;
            case 2:
                promiseChartObj = initCategoryChart();
                break;
            case 3:
                promiseChartObj = initRRChart();
                break;
            case 4:
                promiseChartObj = initMediumChart();
                break;
            case 5:
                promiseChartObj = initPlaygroundChart();
                break;
            default:
                promiseChartObj = initChart();
        }

        promiseChartObj
            .then(chartObj => {
                document.getElementById("PrimaryBar").innerHTML = "";
                chartObj.renderTo("#PrimaryBar");
                chart = chartObj;
                setDYK(getDYK());
            })
            .catch(err => console.error(err));
    };
}

var res;
const init = () => {
    res = new TNEducation();

    res.showProgress();

    res.fetchSource()
        .then(() => {
            res.init();
            res.setLastUpdated();
            res.updateLocalization();
            res.hideProgress();
        })
        .catch(err => console.error(err));

    res.initLocalization();
};

/**
 * Select various types of Charts.
 * @param  {String} value [Value of chart to be displayed.]
 */
const onSelect = value => {
    res.setCategory(value);
    res.init();
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
