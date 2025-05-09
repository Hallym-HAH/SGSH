const HOURS = [
    '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'
];

function getHourLimit(formattedDate) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    if (formattedDate < todayStr) {
        // 과거 날짜면 모두 표시
        return 20;
    }
    if (formattedDate > todayStr) {
        // 미래 날짜면 아무것도 표시하지 않음
        return 7;
    }
    // 오늘이면 현재 시간까지 표시
    return today.getHours();
}

export const chartData = (formattedDate, orders = {}) => {
    const hourLimit = getHourLimit(formattedDate);

    return {
        title: "누적 매출",
        options: {
            chart: { id: "basic-bar", type: 'line', toolbar: { show: false }, zoom: { enabled: false, allowMouseWheelZoom: false }, },
            xaxis: { categories: HOURS.map(h => Number(h)) },
            yaxis: { min: 0, },
            tooltip: { x: { formatter: (value) => `${value + 7}시` }, y: { formatter: (value) => `${value}원` }, },
            dataLabels: { enabled: false },
            noData: { text: '데이터가 없습니다.' },
        },
        series: [
            {
                name: "누적 매출",
                data: HOURS.map(
                    h => {
                        const hourNum = Number(h);
                        if (hourNum > hourLimit) return null;
                        return (orders.cumulative && orders.cumulative[`${formattedDate} ${h}`]) ?? 0;
                    }
                )
            }
        ],
    };
};

export const chartData2 = (formattedDate, orders = {}) => {
    const hourLimit = getHourLimit(formattedDate);

    return {
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
                x: { formatter: (value) => `${value + 7}시` },
                y: { formatter: (value) => `${value}원` },
            },
            dataLabels: { enabled: false },
            noData: { text: '데이터가 없습니다.' },
        },
        series: [
            {
                name: "매출",
                data: HOURS.map(
                    h => {
                        const hourNum = Number(h);
                        if (hourNum > hourLimit) return null;
                        return (orders.result && orders.result[`${formattedDate} ${h}`]) ?? 0;
                    }
                )
            }
        ],
    };
};

export const chartData3 = (formattedDate, orders = {}) => {
    const hourLimit = getHourLimit(formattedDate);

    const orderByTimeArr = HOURS.map(h => {
        const hourNum = Number(h);
        if (hourNum > hourLimit) return null;
        return (orders.orderByTime && orders.orderByTime[`${formattedDate} ${h}`]) ?? 0;
    });
    // max는 null 제외하고 계산
    const max = Math.max(...orderByTimeArr.filter(v => v !== null), 0);

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
            tooltip: { x: { formatter: (value) => `${value + 7}시` }, y: { formatter: (value) => `${value}건` }, },
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
