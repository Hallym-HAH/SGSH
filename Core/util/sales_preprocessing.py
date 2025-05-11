# -*- coding: utf-8 -*-

# 필요한 라이브러리 임포트
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder
from collections import Counter, defaultdict
import seaborn as sns

def preprocess_sta(sta):
    """총매출 문자열을 일/주/월 별 매출 딕셔너리로 변환"""
    parts = sta.split('_')
    return {'today': int(parts[0]), 'week': int(parts[1]), 'month': int(parts[2])}

def preprocess_orders(order_str):
    """주문 목록 문자열을 딕셔너리 리스트로 변환"""
    orders = order_str.split('-')
    order_list = []
    for order in orders:
        id_, name, price, count = order.split('_')
        order_list.append({
            'id': id_,
            'name': name,
            'price': int(price),
            'count': int(count)
        })
    return order_list

def preprocess_sales_by_time(sales_str):
    """시간대별 매출 문자열을 정수 리스트로 변환"""
    return list(map(int, sales_str.split('_')))

def get_top_5_menus(order_list):
    """판매량 기준 상위 5개 메뉴 추출"""
    menu_counter = Counter()
    for order in order_list:
        menu_counter[order['name']] += order['count']
    return menu_counter.most_common(5)

def convert_sales_for_visualization(sales_by_time):
    """시간대별 매출을 시각화하기 좋은 형태로 변환"""
    hours = list(range(8, 21))  # 8시부터 20시까지
    return [{'hour': h, 'sales': s} for h, s in zip(hours, sales_by_time)]

def get_order_dict(order_list):
    """주문 목록을 주문 ID 기준으로 그룹화"""
    order_dict = defaultdict(list)
    for order in order_list:
        order_dict[order['id']].append(order)
    return order_dict

def get_top_5_menu_combinations(order_list):
    """자주 함께 주문되는 메뉴 조합 상위 5개 추출"""
    order_dict = get_order_dict(order_list)
    combo_counter = Counter()
    for orders in order_dict.values():
        # 중복 메뉴를 제거하기 위해 set 사용
        names = sorted(set([o['name'] for o in orders]))
        # 2개 이상 조합만 고려
        for i in range(len(names)):
            for j in range(i+1, len(names)):
                combo = (names[i], names[j])
                combo_counter[combo] += 1
    return combo_counter.most_common(5)


def get_most_frequent_combo_with_menu(order_list, menu):
    """특정 메뉴와 가장 자주 함께 주문되는 메뉴 찾기"""
    order_dict = get_order_dict(order_list)
    combo_counter = Counter()
    for orders in order_dict.values():
        names = sorted([o['name'] for o in orders])
        if menu in names:
            for other in names:
                if other != menu:
                    combo_counter[(menu, other)] += 1
    if combo_counter:
        return combo_counter.most_common(1)
    else:
        return None

def get_total_sales_by_combo(order_list):
    """메뉴 조합별 총 매출액 계산"""
    order_dict = get_order_dict(order_list)
    sales_by_combo = defaultdict(int)
    for orders in order_dict.values():
        # 중복 메뉴를 제거하기 위해 set 사용
        names = sorted(set([o['name'] for o in orders]))
        total_price = sum(o['price'] * o['count'] for o in orders)
        # 2개 이상 조합만 고려
        for i in range(len(names)):
            for j in range(i+1, len(names)):
                combo = (names[i], names[j])
                sales_by_combo[combo] += total_price
    return sorted(sales_by_combo.items(), key=lambda x: x[1], reverse=True)[:5]


def find_frequent_itemsets(order_list, min_support=0.5, max_len=3):
    """연관 규칙 탐색 알고리즘을 이용한 메뉴 패턴 분석"""
    order_dict = get_order_dict(order_list)
    transactions = []
    for orders in order_dict.values():
        # 중복 메뉴를 제거하기 위해 set 사용
        transactions.append(list(set([o['name'] for o in orders])))

    # 데이터가 없거나 패턴이 없을 경우 빈 DataFrame 반환
    if not transactions:
        return pd.DataFrame(columns=['support', 'itemsets', 'length', 'order_count', 'total_sales'])

    te = TransactionEncoder()
    te_ary = te.fit(transactions).transform(transactions)
    df = pd.DataFrame(te_ary, columns=te.columns_)

    # 빈발 패턴 탐지
    frequent_itemsets = apriori(df, min_support=min_support, use_colnames=True, max_len=max_len)

    if len(frequent_itemsets) == 0:
        return pd.DataFrame(columns=['support', 'itemsets', 'length', 'order_count', 'total_sales'])

    frequent_itemsets['length'] = frequent_itemsets['itemsets'].apply(lambda x: len(x))

    # 총 주문 횟수와 매출 계산
    frequent_itemsets['order_count'] = frequent_itemsets['itemsets'].apply(
        lambda x: sum(1 for t in transactions if x.issubset(t))
    )

    # 매출 계산 함수
    def calc_sales(itemset):
        total = 0
        for orders in order_dict.values():
            names = [o['name'] for o in orders]
            if itemset.issubset(names):
                total += sum(o['price'] * o['count'] for o in orders if o['name'] in itemset)
        return total

    frequent_itemsets['total_sales'] = frequent_itemsets['itemsets'].apply(calc_sales)

    return frequent_itemsets.sort_values(by='order_count', ascending=False)


def analyze_sales_data(sta, t_od, w_od, m_od, t_sts, w_sts, m_sts):
    """모든 데이터를 전처리하고 종합 분석 결과를 반환"""
    result = {}

    # 1. 모든 데이터 전처리
    result['sales'] = preprocess_sta(sta)
    result['today_orders'] = preprocess_orders(t_od)
    result['week_orders'] = preprocess_orders(w_od)
    result['month_orders'] = preprocess_orders(m_od)
    result['today_sales_by_time'] = preprocess_sales_by_time(t_sts)
    result['week_sales_by_time'] = preprocess_sales_by_time(w_sts)
    result['month_sales_by_time'] = preprocess_sales_by_time(m_sts)

    # 2. 시각화용 시간대별 매출 데이터
    result['today_sales_viz'] = convert_sales_for_visualization(result['today_sales_by_time'])
    result['week_sales_viz'] = convert_sales_for_visualization(result['week_sales_by_time'])
    result['month_sales_viz'] = convert_sales_for_visualization(result['month_sales_by_time'])

    # 3. 인기 메뉴 분석
    result['today_top_menus'] = get_top_5_menus(result['today_orders'])
    result['week_top_menus'] = get_top_5_menus(result['week_orders'])
    result['month_top_menus'] = get_top_5_menus(result['month_orders'])

    # 4. 메뉴 조합 분석
    result['today_top_combos'] = get_top_5_menu_combinations(result['today_orders'])
    result['week_top_combos'] = get_top_5_menu_combinations(result['week_orders'])
    result['month_top_combos'] = get_top_5_menu_combinations(result['month_orders'])

    # 5. 메뉴 조합 매출 분석
    result['today_combo_sales'] = get_total_sales_by_combo(result['today_orders'])
    result['week_combo_sales'] = get_total_sales_by_combo(result['week_orders'])
    result['month_combo_sales'] = get_total_sales_by_combo(result['month_orders'])

    # 6. 패턴 분석 (min_support를 낮게 설정하여 데이터가 적어도 패턴을 발견할 수 있게 함)
    result['today_patterns'] = find_frequent_itemsets(result['today_orders'], min_support=0.1, max_len=3)
    result['week_patterns'] = find_frequent_itemsets(result['week_orders'], min_support=0.1, max_len=3)
    result['month_patterns'] = find_frequent_itemsets(result['month_orders'], min_support=0.1, max_len=3)

    return result


# def visualize_sales_by_time(sales_viz, title="시간대별 매출"):
#     """시간대별 매출 데이터 시각화"""
#     hours = [item['hour'] for item in sales_viz]
#     sales = [item['sales'] for item in sales_viz]
#
#     plt.figure(figsize=(10, 6))
#     plt.plot(hours, sales, marker='o', linewidth=2)
#     plt.title(title)
#     plt.xlabel('시간')
#     plt.ylabel('매출 (원)')
#     plt.grid(True, linestyle='--', alpha=0.7)
#     plt.xticks(hours)
#     plt.tight_layout()
#     plt.show()
#
#
# def visualize_top_menus(top_menus, title="인기 메뉴"):
#     """인기 메뉴 시각화"""
#     menus = [item[0] for item in top_menus]
#     counts = [item[1] for item in top_menus]
#
#     plt.figure(figsize=(10, 6))
#     plt.bar(menus, counts, color='skyblue')
#     plt.title(title)
#     plt.xlabel('메뉴')
#     plt.ylabel('판매량')
#     plt.grid(True, axis='y', linestyle='--', alpha=0.7)
#     plt.tight_layout()
#     plt.show()

def get_sample_data():

    sample = {
        'sta': '954_7236_92487',
        't_od': '1_커피_4000_2-1_케이크_6000_1-2_샌드위치_7000_1-2_주스_5000_1-3_커피_4000_1-3_도넛_3000_2-4_커피_4000_2-4_케이크_6000_1-5_커피_4000_2-5_케이크_6000_1-6_샌드위치_7000_1-6_주스_5000_1-7_커피_4000_1-7_도넛_3000_2-8_커피_4000_2-8_케이크_6000_1-9_커피_4000_2-9_크로플_4500_1-9_마카롱_2000_2-10_커피_4000_2-10_케이크_6000_1-11_케이크_6000_1-11_주스_5000_1-11_샌드위치_7000_1-12_커피_4000_1-12_도넛_3000_3-13_커피_4000_2-13_케이크_6000_1-14_커피_4000_2-14_케이크_6000_1-15_샌드위치_7000_1-15_주스_5000_2-16_커피_4000_1-16_도넛_3000_2-17_커피_4000_2-17_케이크_6000_1-18_커피_4000_2-18_도넛_3000_2-19_샌드위치_7000_1-19_주스_5000_1-20_커피_4000_2-20_크로플_4500_1-20_마카롱_2000_2',
        'w_od': '21_커피_4000_2-21_케이크_6000_1-22_샌드위치_7000_1-22_주스_5000_1-23_커피_4000_1-23_도넛_3000_2-24_커피_4000_2-24_케이크_6000_1-25_커피_4000_3-25_케이크_6000_1-26_샌드위치_7000_1-26_주스_5000_1-27_커피_4000_1-27_도넛_3000_3-28_커피_4000_2-28_케이크_6000_1-29_커피_4000_2-29_크로플_4500_1-29_마카롱_2000_3-30_커피_4000_2-30_케이크_6000_1-31_케이크_6000_1-31_주스_5000_1-31_샌드위치_7000_2-32_커피_4000_1-32_도넛_3000_3-33_커피_4000_2-33_케이크_6000_1-34_커피_4000_2-34_케이크_6000_1-35_샌드위치_7000_1-35_주스_5000_2-36_커피_4000_1-36_도넛_3000_1-37_커피_4000_2-37_케이크_6000_2-38_커피_4000_2-38_도넛_3000_2-39_샌드위치_7000_1-39_주스_5000_1-40_커피_4000_2-40_크로플_4500_1-40_마카롱_2000_2-41_커피_4000_2-41_케이크_6000_1-42_샌드위치_7000_1-42_주스_5000_2-43_커피_4000_1-43_도넛_3000_2-44_커피_4000_2-44_케이크_6000_1-45_쿠키_2500_2-45_티라미수_6500_1-46_샌드위치_7000_1-46_주스_5000_1-47_커피_4000_1-47_도넛_3000_2-48_커피_4000_2-48_케이크_6000_1-49_커피_4000_2-49_크로플_4500_1-49_마카롱_2000_2-50_커피_4000_2-50_케이크_6000_1-51_케이크_6000_1-51_주스_5000_1-51_샌드위치_7000_1-52_커피_4000_1-52_도넛_3000_2-53_커피_4000_2-53_케이크_6000_1-54_커피_4000_2-54_케이크_6000_1-55_샌드위치_7000_1-55_주스_5000_1-56_커피_4000_1-56_도넛_3000_2-57_커피_4000_2-57_케이크_6000_1-58_스무디_5500_3-58_쿠키_2500_2-59_샌드위치_7000_1-59_주스_5000_1-60_커피_4000_2-60_크로플_4500_1-60_마카롱_2000_2',
        'm_od': '61_커피_4000_2-61_케이크_6000_1-62_샌드위치_7000_1-62_주스_5000_1-63_커피_4000_1-63_도넛_3000_2-64_커피_4000_2-64_케이크_6000_1-65_커피_4000_2-65_케이크_6000_1-66_샌드위치_7000_1-66_주스_5000_1-67_커피_4000_1-67_도넛_3000_2-68_커피_4000_2-68_케이크_6000_1-69_커피_4000_2-69_크로플_4500_1-69_마카롱_2000_2-70_커피_4000_2-70_케이크_6000_1-71_케이크_6000_1-71_주스_5000_1-71_샌드위치_7000_1-72_커피_4000_1-72_도넛_3000_2-73_커피_4000_2-73_케이크_6000_1-74_커피_4000_2-74_케이크_6000_1-75_샌드위치_7000_1-75_주스_5000_1-76_커피_4000_1-76_도넛_3000_2-77_커피_4000_2-77_케이크_6000_1-78_커피_4000_2-78_도넛_3000_2-79_샌드위치_7000_1-79_주스_5000_1-80_커피_4000_2-80_크로플_4500_1-80_마카롱_2000_2-81_커피_4000_2-81_케이크_6000_2-82_샌드위치_7000_1-82_주스_5000_1-83_커피_4000_1-83_도넛_3000_2-84_커피_4000_2-84_케이크_6000_1-85_커피_4000_2-85_케이크_6000_1-86_샌드위치_7000_1-86_주스_5000_1-87_커피_4000_1-87_도넛_3000_2-88_커피_4000_2-88_케이크_6000_1-89_커피_4000_2-89_크로플_4500_1-89_마카롱_2000_2-90_커피_4000_2-90_케이크_6000_1-91_케이크_6000_1-91_주스_5000_1-91_샌드위치_7000_1-92_커피_4000_1-92_도넛_3000_2-93_커피_4000_2-93_케이크_6000_1-94_커피_4000_2-94_케이크_6000_1-95_샌드위치_7000_1-95_주스_5000_1-96_커피_4000_1-96_도넛_3000_2-97_커피_4000_2-97_케이크_6000_1-98_커피_4000_2-98_도넛_3000_3-99_샌드위치_7000_1-99_주스_5000_1-100_커피_4000_3-100_크로플_4500_1-100_마카롱_2000_2-101_커피_4000_2-101_케이크_6000_1-102_샌드위치_7000_1-102_주스_5000_1-103_커피_4000_1-103_도넛_3000_2-104_커피_4000_2-104_케이크_6000_1-105_커피_4000_1-105_케이크_6000_1-106_샌드위치_7000_1-106_주스_5000_1-107_커피_4000_1-107_도넛_3000_2-108_커피_4000_2-108_케이크_6000_2-109_커피_4000_2-109_크로플_4500_1-109_마카롱_2000_3-110_커피_4000_2-110_케이크_6000_1-111_케이크_6000_1-111_주스_5000_1-111_샌드위치_7000_1-112_커피_4000_1-112_도넛_3000_2-113_커피_4000_2-113_케이크_6000_1-114_커피_4000_2-114_케이크_6000_1-115_샌드위치_7000_1-115_주스_5000_1-116_커피_4000_1-116_도넛_3000_3-117_커피_4000_2-117_케이크_6000_1-118_커피_4000_3-118_도넛_3000_2-119_샌드위치_7000_1-119_주스_5000_1-120_커피_4000_2-120_크로플_4500_1-120_마카롱_2000_2',
        't_sts': '7562_8943_9124_8765_7689_6234_5873_6798_7234_7865_8123_7654_6532',
        'w_sts': '56987_61324_67845_78965_89753_93421_87654_76543_65432_71234_68754_59876_47865',
        'm_sts': '453678_478965_512345_567894_598765_624356_687543_765432_832156_854321_798765_732145_654321'
    }

    return sample


def print_analysis_result_with_explanation(analysis_result):
    """analysis_result 객체의 모든 구성 요소를 자세한 설명과 함께 출력"""
    print("\n" + "=" * 80)
    print("                      매장 매출 데이터 분석 결과 상세 출력")
    print("=" * 80)

    # 1. 총매출 정보
    print("\n1. sales: 총매출 정보 (일별, 주별, 월별)")
    print("-" * 50)
    print(f"오늘 매출: {analysis_result['sales']['today']:,}원")
    print(f"이번 주 매출: {analysis_result['sales']['week']:,}원")
    print(f"이번 달 매출: {analysis_result['sales']['month']:,}원")

    # 2. 주문 목록
    # print("\n2. orders: 주문 목록 (일별, 주별, 월별)")
    # print("-" * 50)
    #
    # print("\n2.1 오늘의 주문 목록 (최대 3개 표시)")
    # for i, order in enumerate(analysis_result['today_orders'][:3], 1):
    #     print(f"  주문 {i}: ID={order['id']}, 메뉴={order['name']}, 가격={order['price']:,}원, 수량={order['count']}개")
    # print(f"  총 {len(analysis_result['today_orders'])}개 주문")
    #
    # print("\n2.2 이번 주 주문 목록 (최대 3개 표시)")
    # for i, order in enumerate(analysis_result['week_orders'][:3], 1):
    #     print(f"  주문 {i}: ID={order['id']}, 메뉴={order['name']}, 가격={order['price']:,}원, 수량={order['count']}개")
    # print(f"  총 {len(analysis_result['week_orders'])}개 주문")
    #
    # print("\n2.3 이번 달 주문 목록 (최대 3개 표시)")
    # for i, order in enumerate(analysis_result['month_orders'][:3], 1):
    #     print(f"  주문 {i}: ID={order['id']}, 메뉴={order['name']}, 가격={order['price']:,}원, 수량={order['count']}개")
    # print(f"  총 {len(analysis_result['month_orders'])}개 주문")

    # 3. 시간대별 매출
    print("\n3. sales_by_time: 시간대별 매출 (8시~20시)")
    print("-" * 50)

    print("\n3.1 오늘의 시간대별 매출")
    for i, sales in enumerate(analysis_result['today_sales_by_time'], 8):
        print(f"  {i}시: {sales:,}원")

    print("\n3.2 이번 주 시간대별 평균 매출")
    for i, sales in enumerate(analysis_result['week_sales_by_time'], 8):
        print(f"  {i}시: {sales:,}원")

    print("\n3.3 이번 달 시간대별 평균 매출")
    for i, sales in enumerate(analysis_result['month_sales_by_time'], 8):
        print(f"  {i}시: {sales:,}원")

    # 4. 시각화용 시간대별 매출 데이터
    print("\n4. sales_viz: 시각화용 시간대별 매출 데이터")
    print("-" * 50)
    print("  형식: [{'hour': 시간, 'sales': 매출}, ...]")
    print("  설명: matplotlib 등으로 시각화할 때 사용하기 편리한 형태의 데이터")
    print(f"  예시: {analysis_result['today_sales_viz'][:3]}...")

    # 5. 인기 메뉴
    print("\n5. top_menus: 판매량 기준 인기 메뉴")
    print("-" * 50)

    print("\n5.1 오늘의 인기 메뉴 TOP 5")
    for i, (menu, count) in enumerate(analysis_result['today_top_menus'], 1):
        print(f"  {i}위: {menu} - {count}개")

    print("\n5.2 이번 주 인기 메뉴 TOP 5")
    for i, (menu, count) in enumerate(analysis_result['week_top_menus'], 1):
        print(f"  {i}위: {menu} - {count}개")

    print("\n5.3 이번 달 인기 메뉴 TOP 5")
    for i, (menu, count) in enumerate(analysis_result['month_top_menus'], 1):
        print(f"  {i}위: {menu} - {count}개")

    # 6. 인기 메뉴 조합
    print("\n6. top_combos: 자주 함께 주문되는 메뉴 조합")
    print("-" * 50)

    print("\n6.1 오늘의 인기 메뉴 조합 TOP 5")
    if analysis_result['today_top_combos']:
        for i, ((menu1, menu2), count) in enumerate(analysis_result['today_top_combos'], 1):
            print(f"  {i}위: {menu1} + {menu2} - {count}회")
    else:
        print("  데이터 없음")

    print("\n6.2 이번 주 인기 메뉴 조합 TOP 5")
    if analysis_result['week_top_combos']:
        for i, ((menu1, menu2), count) in enumerate(analysis_result['week_top_combos'], 1):
            print(f"  {i}위: {menu1} + {menu2} - {count}회")
    else:
        print("  데이터 없음")

    print("\n6.3 이번 달 인기 메뉴 조합 TOP 5")
    if analysis_result['month_top_combos']:
        for i, ((menu1, menu2), count) in enumerate(analysis_result['month_top_combos'], 1):
            print(f"  {i}위: {menu1} + {menu2} - {count}회")
    else:
        print("  데이터 없음")

    # 7. 메뉴 조합별 매출
    print("\n7. combo_sales: 메뉴 조합별 총 매출액")
    print("-" * 50)

    print("\n7.1 오늘의 메뉴 조합별 매출 TOP 5")
    if analysis_result['today_combo_sales']:
        for i, ((menu1, menu2), sales) in enumerate(analysis_result['today_combo_sales'], 1):
            print(f"  {i}위: {menu1} + {menu2} - {sales:,}원")
    else:
        print("  데이터 없음")

    print("\n7.2 이번 주 메뉴 조합별 매출 TOP 5")
    if analysis_result['week_combo_sales']:
        for i, ((menu1, menu2), sales) in enumerate(analysis_result['week_combo_sales'], 1):
            print(f"  {i}위: {menu1} + {menu2} - {sales:,}원")
    else:
        print("  데이터 없음")

    print("\n7.3 이번 달 메뉴 조합별 매출 TOP 5")
    if analysis_result['month_combo_sales']:
        for i, ((menu1, menu2), sales) in enumerate(analysis_result['month_combo_sales'], 1):
            print(f"  {i}위: {menu1} + {menu2} - {sales:,}원")
    else:
        print("  데이터 없음")

    # 8. 빈발 패턴
    print("\n8. patterns: 연관 규칙 마이닝을 통한 메뉴 패턴 분석")
    print("-" * 50)
    print("  설명: 주문 데이터에서 자주 발생하는 메뉴 조합을 찾아내는 분석")

    print("\n8.1 오늘의 빈발 패턴 (상위 3개)")
    if len(analysis_result['today_patterns']) > 0:
        for i, row in analysis_result['today_patterns'].head(3).iterrows():
            itemset_str = ', '.join(list(row['itemsets']))
            print(f"  패턴 {i + 1}: {itemset_str}")
            print(f"    - 지지도: {row['support']:.3f}")
            print(f"    - 주문 횟수: {row['order_count']}회")
            print(f"    - 총 매출: {row['total_sales']:,}원")
    else:
        print("  데이터 없음")

    print("\n8.2 이번 주 빈발 패턴 (상위 3개)")
    if len(analysis_result['week_patterns']) > 0:
        for i, row in analysis_result['week_patterns'].head(3).iterrows():
            itemset_str = ', '.join(list(row['itemsets']))
            print(f"  패턴 {i + 1}: {itemset_str}")
            print(f"    - 지지도: {row['support']:.3f}")
            print(f"    - 주문 횟수: {row['order_count']}회")
            print(f"    - 총 매출: {row['total_sales']:,}원")
    else:
        print("  데이터 없음")

    print("\n8.3 이번 달 빈발 패턴 (상위 3개)")
    if len(analysis_result['month_patterns']) > 0:
        for i, row in analysis_result['month_patterns'].head(3).iterrows():
            itemset_str = ', '.join(list(row['itemsets']))
            print(f"  패턴 {i + 1}: {itemset_str}")
            print(f"    - 지지도: {row['support']:.3f}")
            print(f"    - 주문 횟수: {row['order_count']}회")
            print(f"    - 총 매출: {row['total_sales']:,}원")
    else:
        print("  데이터 없음")

    print("\n" + "=" * 80)
    print("                      분석 결과 출력 완료")
    print("=" * 80)


# 6. 실행 코드
if __name__ == "__main__":
    # 샘플 데이터 생성
    sample_data = get_sample_data()

    # 데이터 분석
    analysis_result = analyze_sales_data(
        sample_data["sta"],
        sample_data["t_od"],
        sample_data["w_od"],
        sample_data["m_od"],
        sample_data["t_sts"],
        sample_data["w_sts"],
        sample_data["m_sts"]
    )

    # 분석 결과 출력
    print_analysis_result_with_explanation(analysis_result)