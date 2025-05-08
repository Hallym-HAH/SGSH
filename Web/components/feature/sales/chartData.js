const HOURS = [
    '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'
];

export const chartData = (formattedDate, orders = {}) => ({
    title: "누적 매출",
    options: {
        chart: { id: "basic-bar", type: 'line', toolbar: { show: false }, zoom: { enabled: false, allowMouseWheelZoom: false }, },
        xaxis: { categories: HOURS.map(h => Number(h)) },
        yaxis: { min: 0, },
        tooltip: { x: { formatter: (value) => `${value}시` }, y: { formatter: (value) => `${value}원` }, },
        dataLabels: { enabled: false },
        noData: { text: '데이터가 없습니다.' }, // <- ApexCharts noData 옵션 추가
    },
    series: [
        {
            name: "누적 매출",
            data: HOURS.map(
                h => (orders.cumulative && orders.cumulative[`${formattedDate} ${h}`]) ?? 0
            )
        }
    ],
});

export const chartData2 = (formattedDate, orders = {}) => ({
    title: "시간대별 매출",
    options: {
        chart: {
            id: "basic-bar",
            type: 'line',
            toolbar: { show: false },
            zoom: { enabled: false, allowMouseWheelZoom: false },
        },
        xaxis: { categories: HOURS.map(h => Number(h)) },
        yaxis: { min: 0, },
        tooltip: {
            x: { formatter: (value) => `${value}시` },
            y: { formatter: (value) => `${value}원` },
        },
        dataLabels: { enabled: false },
        noData: { text: '데이터가 없습니다.' },
    },
    series: [
        {
            name: "매출",
            data: HOURS.map(
                h => (orders.result && orders.result[`${formattedDate} ${h}`]) ?? 0
            )
        }
    ],
});

export const chartData3 = (formattedDate, orders = {}) => {
    // orderByTime이 없거나 값이 모두 undefined/null일 경우 0으로 처리
    const orderByTimeArr = HOURS.map(h => (orders.orderByTime && orders.orderByTime[`${formattedDate} ${h}`]) ?? 0);
    const max = Math.max(...orderByTimeArr, 0);

    return {
        title: "시간대별 주문",
        options: {
            chart: { id: "basic-bar", type: 'line', toolbar: { show: false }, zoom: { enabled: false, allowMouseWheelZoom: false }, },
            xaxis: { categories: HOURS.map(h => Number(h)) },
            yaxis: {
                labels: { formatter: function (value) { return Math.round(value); } },
                min: 0,
                max: max,
                tickAmount: max >= 5 ? 5 : max,
                forceNiceScale: true,
            },
            tooltip: { x: { formatter: (value) => `${value}시` }, y: { formatter: (value) => `${value}건` }, },
            dataLabels: { enabled: false },
            noData: { text: '데이터가 없습니다.' },
        },
        series: [
            {
                name: "주문",
                data: orderByTimeArr
            }
        ],
    };
};