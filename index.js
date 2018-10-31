/**
 * Index file.
 */
"use strict";

/**
 * @param  {String}     url         [Url to request]
 * @param  {[type]}     method      [Type of Ajax request]
 * @param  {Function}   callback    [Callback function to call]
 */
const asyncAjax = url => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", url);
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
    });
};

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
    initChart(json.data);
    updateDate(json.updatedAt);
}

/**
 * Chart Initialization.
 * @param  {Array} data [Array of data of Physical infrastructure facilities in Municipality and Corporation schools in Tamil Nadu]
 */
const initChart = data => {
    let mapData = data.map(val => {
        return {
            studentsCount: Number(val.number_of_students),
            school_name: val.school_name,
            district: val.district,
            category: val.category_of_school,
            establishment:
                val.yearof_establishment === "NULL"
                    ? "-"
                    : val.yearof_establishment,
            medium: val.school_medium,
            subjects_offered:
                val.subject_offered === "NULL" ? "-" : val.subject_offered,
            pincode: val.pincode,
            differently_abled: val.number_of_differently_abled_student,
            staffCount: Number(val.number_of_staff),
            number_of_classrooms: val.number_of_classrooms,
            availabilty_of_playground:
                val.availabilty_of_playground === "NULL"
                    ? "-"
                    : val.availabilty_of_playground,
            availabilty_of_eateries: val.availabilty_of_eateries,
            availabilty_of_hospital: val.availabilty_of_hospital,
            number_of_restrooms: Number(val.number_of_restrooms)
        };
    });

    // Chart init.
    let chart = new Taucharts.Chart({
        type: "scatterplot",
        x: "district",
        y: "studentsCount",
        color: "district",
        data: mapData,
        settings: {
            renderingTimeout: 1000
        },
        plugins: [
            Taucharts.api.plugins.get("tooltip")({
                formatters: {
                    studentsCount: {
                        label: "Number of Students"
                    },
                    district: {
                        label: "District"
                    },
                    category: {
                        label: "Category of School"
                    },
                    establishment: {
                        label: "Year of Establishment"
                    },
                    subjects_offered: {
                        label: "Subjects Offered"
                    },
                    medium: {
                        label: "School Medium"
                    },
                    school_name: {
                        label: "School Name"
                    },
                    pincode: {
                        label: "Pincode"
                    },
                    differently_abled: {
                        label: "Number of Differently Abled Students"
                    },
                    staffCount: {
                        label: "Number of Staffs"
                    },
                    number_of_classrooms: {
                        label: "Number of Classrooms"
                    },
                    availabilty_of_playground: {
                        label: "Availability of Playground"
                    },
                    availabilty_of_eateries: {
                        label: "Availability of Eateries"
                    },
                    availabilty_of_hospital: {
                        label: "Availability of Hospital"
                    },
                    number_of_restrooms: {
                        label: "Number of Restrooms"
                    }
                }
            }),
            Taucharts.api.plugins.get("legend")()
        ]
    });

    chart.renderTo("#PrimaryBar");

    initCategoryChart(mapData);
    initRRChart(mapData);
    hideProgress();
};

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

const initRRChart = data => {
    let total = data.length;
    let mapData = data.filter(val => val.number_of_restrooms === 0).map(val => {
        return {
            school_name: val.school_name,
            district: val.district,
            staffCount: val.staffCount,
            studentsCount: val.studentsCount,
            differently_abled: val.differently_abled
        };
    });

    let rr = mapData.length;
    updateRRTotal(rr, total);

    // Chart init.
    let chart = new Taucharts.Chart({
        type: "scatterplot",
        x: "district",
        y: "studentsCount",
        color: "district",
        data: mapData,
        settings: {
            renderingTimeout: 1000
        },
        plugins: [
            Taucharts.api.plugins.get("tooltip")({
                formatters: {
                    school_name: {
                        label: "School Name"
                    },
                    district: {
                        label: "District"
                    },
                    staffCount: {
                        label: "Number of Staffs"
                    },
                    studentsCount: {
                        label: "Number of Students"
                    },
                    differently_abled: {
                        label: "Number of Differently Abled Students"
                    }
                }
            }),
            Taucharts.api.plugins.get("legend")()
        ]
    });

    chart.renderTo("#RRBar");
};

const initCategoryChart = data => {
    let mapObj = groupBy(data, "category");

    let mapData = [];

    for (let key in mapObj) {
        let obj = {
            category: key,
            schoolCount: mapObj[key].length,
            studentsCount: mapObj[key].reduce((a, b) => a + b.studentsCount, 0),
            staffCount: mapObj[key].reduce((a, b) => a + b.staffCount, 0)
        };
        mapData.push(obj);
    }

    // Chart init.
    let chart = new Taucharts.Chart({
        type: "bar",
        x: "category",
        y: "schoolCount",
        color: "category",
        data: mapData,
        settings: {
            renderingTimeout: 1000
        },
        plugins: [
            Taucharts.api.plugins.get("tooltip")({
                formatters: {
                    schoolCount: {
                        label: "Schools"
                    },
                    studentsCount: {
                        label: "Students"
                    },
                    staffCount: {
                        label: "Staffs"
                    },
                    category: {
                        label: "Category"
                    }
                }
            }),
            Taucharts.api.plugins.get("legend")()
        ]
    });

    chart.renderTo("#CategoryBar");
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
