export const chartData = (formattedDate, orders) => ({
    title: "누적 매출",
    options: {
        chart: { id: "basic-bar", type: 'line', toolbar: { show: false }, zoom: { enabled: false, allowMouseWheelZoom: false }, },
        xaxis: { categories: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
        yaxis: { min: 0, },
        tooltip: { x: { formatter: (value) => `${value}시` }, y: { formatter: (value) => `${value}원` }, },
        dataLabels: { enabled: false },
    },
    series: [
        {
            name: "누적 매출",
            data: [
                orders.cumulative[`${formattedDate} 08`],
                orders.cumulative[`${formattedDate} 09`],
                orders.cumulative[`${formattedDate} 10`],
                orders.cumulative[`${formattedDate} 11`],
                orders.cumulative[`${formattedDate} 12`],
                orders.cumulative[`${formattedDate} 13`],
                orders.cumulative[`${formattedDate} 14`],
                orders.cumulative[`${formattedDate} 15`],
                orders.cumulative[`${formattedDate} 16`],
                orders.cumulative[`${formattedDate} 17`],
                orders.cumulative[`${formattedDate} 18`],
                orders.cumulative[`${formattedDate} 19`],
                orders.cumulative[`${formattedDate} 20`],
            ]
        }
    ],
});
export const chartData2 = (formattedDate, orders) => ({
    title: "시간대별 매출",
    options: {
        chart: {
            id: "basic-bar",
            type: 'line',
            toolbar: { show: false },
            zoom: { enabled: false, allowMouseWheelZoom: false },
        },
        xaxis: { categories: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
        yaxis: { min: 0, },
        tooltip: {
            x: { formatter: (value) => `${value}시` },
            y: { formatter: (value) => `${value}원` },
        },
        dataLabels: { enabled: false },
    },
    series: [
        {
            name: "매출",
            data: [
                orders.result[`${formattedDate} 08`],
                orders.result[`${formattedDate} 09`],
                orders.result[`${formattedDate} 10`],
                orders.result[`${formattedDate} 11`],
                orders.result[`${formattedDate} 12`],
                orders.result[`${formattedDate} 13`],
                orders.result[`${formattedDate} 14`],
                orders.result[`${formattedDate} 15`],
                orders.result[`${formattedDate} 16`],
                orders.result[`${formattedDate} 17`],
                orders.result[`${formattedDate} 18`],
                orders.result[`${formattedDate} 19`],
                orders.result[`${formattedDate} 20`],
            ]
        }
    ],
});

export const chartData3 = (formattedDate, orders) => ({
    title: "시간대별 주문",
    options: {
        chart: { id: "basic-bar", type: 'line', toolbar: { show: false }, zoom: { enabled: false, allowMouseWheelZoom: false }, },
        xaxis: { categories: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
        yaxis: { min: 0, },
        yaxis: {
            labels: { formatter: function (value) { return Math.round(value); } },
            min: 0, max: Math.max(...Object.values(orders.orderByTime)), tickAmount: Math.max(...Object.values(orders.orderByTime)) >= 5 ? 5 : Math.max(...Object.values(orders.orderByTime)),
            forceNiceScale: true,
        },
        tooltip: { x: { formatter: (value) => `${value}시` }, y: { formatter: (value) => `${value}건` }, },
        dataLabels: { enabled: false },
    },
    series: [
        {
            name: "주문",
            data: [
                orders.orderByTime[`${formattedDate} 08`],
                orders.orderByTime[`${formattedDate} 09`],
                orders.orderByTime[`${formattedDate} 10`],
                orders.orderByTime[`${formattedDate} 11`],
                orders.orderByTime[`${formattedDate} 12`],
                orders.orderByTime[`${formattedDate} 13`],
                orders.orderByTime[`${formattedDate} 14`],
                orders.orderByTime[`${formattedDate} 15`],
                orders.orderByTime[`${formattedDate} 16`],
                orders.orderByTime[`${formattedDate} 17`],
                orders.orderByTime[`${formattedDate} 18`],
                orders.orderByTime[`${formattedDate} 19`],
                orders.orderByTime[`${formattedDate} 20`],
            ]
        }
    ],
});
