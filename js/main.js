$(function () {
    $("#cbb-standings").select2({
        templateResult: formatState,
        data: [
            {
                id: "3ddfd979-8e01-4fd9-87bd-038bf3ffe8cb",
                text: "Preimer League",
                logo: "https://futhead.cursecdn.com/static/img/23/leagues/13.png",
            },
            {
                id: "1e51d4c9-c7bd-4bdb-894e-3a71e087dbf5",
                text: "La Liga",
                logo: "https://futhead.cursecdn.com/static/img/17/leagues/53.png",
            },
            {
                id: "5789d121-8e9b-4b5e-aa06-8957ec1ec49c",
                text: "Bundesliga",
                logo: "https://futhead.cursecdn.com/static/img/23/leagues/19.png",
            },
            {
                id: "ae468c32-212b-4056-9c95-83c204d8d269",
                text: "Serie A",
                logo: "https://futhead.cursecdn.com/static/img/23/leagues/31.png",
            },
            {
                id: "fa4b141c-cf9c-4fcf-a08c-ad8d03624ba4",
                text: "League 1",
                logo: "https://futhead.cursecdn.com/static/img/23/leagues/16.png",
            },
            {
                id: "4c30b4f2-9e89-40dc-8b27-e08c98db233d",
                text: "V League",
                logo: "https://stvinaprod.vtvcab.vn/StockDesignOnTV/Logo%20gi%E1%BA%A3i%20%C4%91%E1%BA%A5u/V-League_1.png?auto=format&fit=max&w=96",
            },
            {
                id: "268b85d8-f251-4e78-b295-71efe392bbf0",
                text: "V League 2",
                logo: "https://stvinaprod.vtvcab.vn/StockDesignOnTV/Logo%20gi%E1%BA%A3i%20%C4%91%E1%BA%A5u/V-League%202.png?auto=format&fit=max&w=96",
            },
        ],
    });

    $('[data-type="tab-control"]').each(function () {
        if ($(this).attr("tab-show")) {
            $(this).trigger("click");
        }
    });
    flatpickr("#date", {
        locale: "vn",
        dateFormat: "d/m/Y",
        altFormat: "d/m/Y",
        defaultDate: "today",
        onChange: function (selectedDates, dateStr, instance) {
            // var date = moment(new Date(selectedDates)).format("YYYYMMDD");
            // getData(date);
            var date = moment(new Date($("#date")[0]._flatpickr.selectedDates[0])).format("YYYYMMDD");
            getData(date);
        },
    });

    $(".shortcut-buttons-flatpickr-button").addClass("text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800");

    $("#btn-search").on("click", function () {
        var date = moment(new Date($("#date")[0]._flatpickr.selectedDates[0])).format("YYYYMMDD");
        getData(date);
    });

    $("#btn-search").trigger("click");
    getStandings("3ddfd979-8e01-4fd9-87bd-038bf3ffe8cb");

    $(document).on("click", "button[data-type='btn-filter']", function () {
        $("#tournament")
            .find("button[data-type='btn-filter']")
            .each(function () {
                $(this).removeClass("bg-blue-700 text-white");
            });
        $(this).addClass("bg-blue-700 text-white");
        const id = $(this).attr("id");
        $(`button[data-type="match"]`).each(function () {
            $(this).addClass("invisible opaciy-0 hidden");
        });
        $(`button[tournament='${id}']`).each(function () {
            $(this).removeClass("invisible opaciy-0 hidden");
        });
        if (id == "all") {
            $(`button[data-type="match"]`).each(function () {
                $(this).removeClass("invisible opaciy-0 hidden");
            });
        }
    });

    $(document).on("change", "#cbb-standings", function () {
        getStandings($(this).val());
    });
});

function formatState(state) {
    if (!state.id) {
        return state.text;
    }
    var $state = $(`
        <div class="flex items-center">
            <img class="h-10 w-10 object-contain" src="${state.logo}" />
            <span class="px-3">${state.text}</span>
        </div>`);
    return $state;
}

function pad(n) {
    return n < 10 ? "0" + n : n;
}

function sortObj(list, key) {
    function compare(a, b) {
        a = a[key];
        b = b[key];
        var type = typeof a === "string" || typeof b === "string" ? "string" : "number";
        var result;
        if (type === "string") result = a.localeCompare(b);
        else result = a - b;
        return result;
    }
    return list.sort(compare);
}

function getStandings(league = null) {
    let url = `https://soccer-api.api.vinasports.com.vn/api/v1/publish/leagues/ranking?league_id=${league}`;
    $.ajax({
        type: "get",
        url: url,
        success: function (resp) {
            $("#table-standings tbody").empty();
            const response = resp.data.ranks[0].team_ranks;
            $.each(response, function (i, e) {
                let border = "border-white";
                if (e.color == 0) {
                    border = "border-blue-500";
                } else if (e.color == 1) {
                    border = "border-yellow-500";
                } else if (e.color == 2) {
                    border = "border-green-500";
                } else if (e.color >= 3) {
                    border = "border-red-500";
                }
                $("#table-standings tbody").append(`
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300">
                <td scope="row" class="${border} border-l-4 border-5 px-2 text-center border-left-2">${e.team_rank}</td>
                <th scope="row" class="py-4 px-3 flex items-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <img class="h-5" src="${e.team_logo}" alt="">
                    <span class="px-2">${e.team_name}</span>
                </th>
                <td class="py-4 px-3 text-center">
                    ${e.total_count}
                </td>
                <td class="py-4 px-3 text-center">
                    ${e.win_count}
                </td>
                <td class="py-4 px-3 text-center">
                    ${e.draw_count}
                </td>
                <td class="py-4 px-3 text-center">
                    ${e.lose_count}
                </td>
                <td class="py-4 px-3 text-center">
                    ${e.goal_difference}
                </td>
                <td class="py-4 px-3 text-center">
                    ${e.integral}
                </td>
            </tr>`);
            });
        },
        error: function (res) {
            swal("Oops", "Something went wrong!", "error");
            console.log(res);
        },
    });
}

function getData(date = null) {
    $("#all").trigger("click");
    var text = "";
    var html = "";
    var htmlTemp = "";
    var commentators;
    var dateObj = new Date();
    var month = dateObj.getMonth() + 1; //months from 1-12
    var day = dateObj.getDate();
    var year = dateObj.getFullYear();
    var dateLink = `${year}${pad(month)}${pad(day)}`;
    var hlsUrls = [];
    var url = `https://api.vebo.xyz/api/match/fixture/home/${dateLink}`;
    if (date) {
        url = `https://api.vebo.xyz/api/match/fixture/home/${date}`;
    }
    $.ajax({
        url: url,
        success: function (resp) {
            if (resp.data.length == 0) {
                html = `<div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <span class="font-medium">Data not found!</div>`;
                swal("Oops", "Data not found!", "error");
            }
            var lstMatch = sortObj(
                resp.data.filter((x) => x.sport_type == "football"),
                "timestamp"
            );
            text += `#EXTM3U x-tvg-url="http://lichphatsong.xyz/schedule/epg.xml,https://iptvx.one/EPG" tvg-shift=0 m3uautoload=1` + "\n";

            var array = lstMatch.map((x) => x.tournament.unique_tournament);
            var unique = [];
            var distinct = [];
            for (let i = 0; i < array.length; i++) {
                if (!unique[array[i].id]) {
                    distinct.push({
                        id: array[i].id,
                        name: array[i].name,
                        logo: array[i].logo,
                        is_featured: array[i].is_featured,
                    });
                    unique[array[i].id] = 1;
                }
            }

            var lstTournament = distinct.filter((x) => x.is_featured).concat(distinct.filter((x) => !x.is_featured));
            $("#tournament").empty();
            if (lstTournament.length > 0) {
                $("#tournament").append(`
                <button data-type="btn-filter" id="all" type="button" class="bg-blue-700 text-white flex min-w-min gap-2 items-center justify-center font-medium rounded-lg text-sm px-5 py-2.5 mr-2 focus:outline-none border-2">
                <div class="whitespace-nowrap">All</div>
                </button>
                `);
                $.each(lstTournament, function (i, e) {
                    $("#tournament").append(`
                    <button data-type="btn-filter" id="${e.id}" type="button" class="flex min-w-min gap-2 items-center justify-center font-medium rounded-lg text-sm px-5 py-2.5 mr-2 focus:outline-none border-2">
                    <img src="${e.logo}" class="object-contain" style="width: 30px; height: 30px;" alt="">
                    <div class="whitespace-nowrap pr-2">${e.name}</div>
                    </button>
                    `);
                });
            }
            $.each(lstMatch.filter((x) => x.is_featured).concat(lstMatch.filter((x) => !x.is_featured)), function (i, e) {
                commentators = "";
                var link = `#EXTINF:-1 group-title="Trực tiếp" tvg-id="" tvg-logo="${e.tournament.logo}",${moment(e.date).format("DD/MM")} ${moment(e.timestamp).format("HH:mm")} ${e.name}`;
                var hls = "new.m3u8";
                var subUrl = `https://api.vebo.xyz/api/match/${e.id}/meta`;
                htmlTemp = "";
                html += `<button data-type="match" tournament="${e.tournament.unique_tournament.id}" class="relative flex flex-col justify-center items-center rounded-lg overflow-hidden mx-auto border border-gray-300 shadow w-full ${e.timestamp <= new Date().valueOf() ? (e.is_featured ? "border-yellow-500" : "border-green-500") : ""}">
                        <div class="flex font-bold bg-gray-200 w-full p-2 justify-center items-center">
                            <img style="height: 32px; max-width: 50%;" class="object-contain" src="${e.tournament.logo}" alt="" />
                            <span class="truncate px-3" title="${e.tournament.name}">${e.tournament.name}</span>    
                        </div>
                        <div class="flex justify-center items-center p-3 flex-grow w-full">
                            <div class="flex flex-col justify-start items-center h-full w-4/12">
                                <img class="object-contain" style="width: 64px; height: 64px;" src="${e.home.logo || e.tournament.logo}">
                                <span class="text-center" title="${e.home.name}">${e.home.short_name}</span>
                            </div>
                            <div class="text-center flex-grow h-full">
                                <span class="font-bold text-3xl">${e.timestamp <= new Date().valueOf() ? e.scores.home + " - " + e.scores.away : "_ - _"}</span>
                                <div>${moment(e.date).format("DD/MM/YYYY")}</div>
                                <div>${moment(e.timestamp).format("HH:mm")}</div>
                            </div>
                            <div class="flex flex-col justify-start items-center h-full w-4/12">
                                <img class="object-contain" style="width: 64px; height: 64px;" src="${e.away.logo || e.tournament.logo}">
                                <span class="text-center" title="${e.away.name}">${e.away.short_name}</span>
                            </div>
                            </div>
                        <div>@commentators_${e.id}</div>
                        <div class="flex gap-1 justify-center items-center flex-wrap">`;
                if (e.is_live) {
                    $.ajax({
                        async: false,
                        url: subUrl,
                        success: function (resp) {
                            let lstQuality = ["nhà đài", "backup 1", "backup 2"];
                            $.each(resp.data.play_urls, function (si, se) {
                                commentators = resp.data.commentators || [];
                                commentators = commentators.map((x) => x.name);
                                hls = se.url;
                                text += `${link} [${se.name}]` + "\n";
                                text += hls + "\n";
                                hlsUrls.push({ url: se.url, quality: se.name });
                                if (!lstQuality.includes(se.name.toLowerCase())) {
                                    htmlTemp += `<a href="${se.url}" target="_blank" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">${se.name}</a>`;
                                }
                            });
                        },
                        error: function (res) {
                            swal("Oops", "Something went wrong!", "error");
                            console.log(res);
                        },
                    });
                }
                html = html.replaceAll(`@commentators_${e.id}`, `<div class="py-2">${commentators.length > 0 ? `<b>BLV: </b>${commentators}` : commentators}</div>`);
                html += htmlTemp;
                html += `</div></button>`;
            });
            $("#match").html(html);
            $.each(sortObj(sortObj(hlsUrls, "url"), "quality"), function (index, item) {
                $("#test").append(`<div>
                    <div>#EXTINF:-1 group-title="Trực tiếp" tvg-id="" tvg-logo="https://tchiphuong.github.io/iptv/images/vebotv.png",VEBOtv ${index + 1} [${item.quality}]</div>
                    <a href="${item.url}" target="_blank">${item.url}</a>
                    </div>`);
            });
        },
        error: function (res) {
            swal("Oops", "Something went wrong!", "error");
            console.log(res);
        },
    });
}
var btn = $("#button");

$(window).scroll(function () {
    if ($(window).scrollTop() > 60) {
        btn.addClass("show");
    } else {
        btn.removeClass("show");
    }
});

btn.on("click", function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "300");
});

function activeTab(element) {
    $(element)
        .parent()
        .find("button")
        .each(function (i, e) {
            $($(e).find("div")[0]).find("span").removeClass("font-bold");
            $($(e).find("div")[0]).removeClass("bg-indigo-700");
            $($(e).find("div")[1]).addClass("bg-white");
            $($(e).find("div")[1]).removeClass("bg-indigo-700");
            $(e).addClass("text-gray-600").removeClass("text-indigo-700");
        });

    $($(element).find("div")[1]).removeClass("bg-white");
    $($(element).find("div")[1]).addClass("bg-indigo-700");
    $($(element).find("div")[0]).find("span").addClass("font-bold");
    $(element).addClass("text-indigo-700");

    let tabid = $(element).attr("target-tab");
    $('[data-type="tab-item"]').each(function () {
        $(this).addClass("hide-tab");
        $(this).removeClass("show-tab");
        $(this).fadeOut();
    });
    setTimeout(() => {
        $("#" + tabid).removeClass("hide-tab");
        $("#" + tabid).addClass("show-tab");
        $("#" + tabid).fadeIn();
    }, 200);
    if ($(element).attr("target-tab") === "highlights") {
        getHighlights();
    }
}

function getHighlights(page = 1) {
    let url = `https://api.vebo.xyz/api/news/xoilac/list/highlight/${page}`;
    $.ajax({
        async: false,
        url: url,
        success: function (resp) {
            $("#list-highlights").empty();
            let url = `https://api.vebo.xyz/api/news/xoilac/detail/${resp.data.highlight.id}`;
            $.ajax({
                async: false,
                url: url,
                success: function (resp) {
                    video_url = resp.data.video_url;
                },
                error: function (res) {
                    swal("Oops", "Something went wrong!", "error");
                    console.log(res);
                },
            });
            if (resp.data.highlight) {
                $("#first-highlights").html(`
                    <div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:items-start hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                        <img class="object-cover w-full rounded-t-lg md:h-auto w-full md:w-1/2 lg:w-4/12 md:rounded-none md:rounded-l-lg" src="${resp.data.highlight.feature_image}" alt="">
                        <div class="flex flex-col justify-between p-4 leading-normal">
                            <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">${resp.data.highlight.name}</h5>
                            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${resp.data.highlight.description}</p>
                            <div>
                                <a href="${video_url}" target="_blank" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    View
                                    <svg aria-hidden="true" class="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                `);
            }
            $.each(resp.data.list, function (i, e) {
                let url = `https://api.vebo.xyz/api/news/xoilac/detail/${e.id}`;
                let video_url = "";
                $.ajax({
                    async: false,
                    url: url,
                    success: function (resp) {
                        video_url = resp.data.video_url;
                    },
                    error: function (res) {
                        swal("Oops", "Something went wrong!", "error");
                        console.log(res);
                    },
                });
                $("#list-highlights").append(`
                    <div class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <img class="rounded-t-lg" src="${e.feature_image}" alt="" />
                        <div class="p-5">
                            <span>
                                <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white" title="${e.name}">${e.name}</h5>
                            </span>
                            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${e.description}</p>
                            <a href="${video_url}" target="_blank" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                View
                                <svg aria-hidden="true" class="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                `);
            });
            let length = resp.data.total / resp.data.limit;
            var maxItem = 4;
            $("#pagination").empty();
            if (page > 1) {
                $("#pagination").append(`
                    <li>
                        <a href="#" class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                    </li>
                `);
            }
            if (length <= maxItem * 2) {
                for (let i = 0; i < length; i++) {
                    if (page == i + 1) {
                        $("#pagination").append(`
                        <li>
                            <a href="#" aria-current="page" class="px-3 py-2 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">${i + 1}</a>
                        </li>
                    `);
                    } else {
                        $("#pagination").append(`
                        <li>
                            <a href="#" class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${i + 1}</a>
                        </li>
                    `);
                    }
                }
            } else {
                let start = 0;
                let end = maxItem;
                if (length - page >= maxItem) {
                    start = page - maxItem;
                    end = maxItem < page ? page : maxItem;
                }
                for (let i = start; i < end; i++) {
                    if (page == i + 1) {
                        $("#pagination").append(`
                        <li>
                            <a href="#" aria-current="page" class="px-3 py-2 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">${i + 1}</a>
                        </li>
                    `);
                    } else {
                        $("#pagination").append(`
                        <li>
                            <a href="#" class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${i + 1}</a>
                        </li>
                    `);
                    }
                }
                $("#pagination").append(`
                <li>
                    <a href="#" class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"> ... </a>
                </li>
            `);
                for (let i = parseInt(length) - maxItem; i < length; i++) {
                    if (page == i + 1) {
                        $("#pagination").append(`
                        <li>
                            <a href="#" aria-current="page" class="px-3 py-2 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">${i + 1}</a>
                        </li>
                    `);
                    } else {
                        $("#pagination").append(`
                        <li>
                            <a href="#" class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${i + 1}</a>
                        </li>
                    `);
                    }
                }
            }
            if (page < length) {
                $("#pagination").append(`
                    <li>
                        <a href="#" class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                    </li>
            `);
            }
        },
        error: function (res) {
            swal("Oops", "Something went wrong!", "error");
            console.log(res);
        },
    });
}
