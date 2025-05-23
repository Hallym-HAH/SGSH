'use client'

import Manage from "../page";
import ManageNavBar from "@/components/feature/manage_navbar";

import {useState, useEffect, useRef} from 'react';
import {motion} from 'framer-motion';
import {AnimatePresence} from 'framer-motion';
import Script from 'next/script';
import Head from 'next/head';
import {Noto_Sans_KR, Nanum_Gothic, IBM_Plex_Sans_KR, Black_Han_Sans, Jua} from 'next/font/google';
import {supabaseClient} from "@/lib/supabase";

// 폰트 설정
const notoSansKr = Noto_Sans_KR({
    subsets: ['latin'],
    weight: ['400', '700'],
    display: 'swap',
    variable: '--font-noto-sans-kr',
});

const nanumGothic = Nanum_Gothic({
    subsets: ['latin'],
    weight: ['400', '700'],
    display: 'swap',
    variable: '--font-nanum-gothic',
});

const ibmPlexSansKr = IBM_Plex_Sans_KR({
    subsets: ['latin'],
    weight: ['400', '700'],
    display: 'swap',
    variable: '--font-ibm-plex-sans-kr',
});

const blackHanSans = Black_Han_Sans({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
    variable: '--font-black-han-sans',
});

const jua = Jua({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
});

export default function ThumbnailGenerator() {

    const [business, setBusiness] = useState([]);

    // 이미지 관련 상태
    const [image, setImage] = useState({
        src: "https://placehold.co/448x448/000000/000000/png",
        // src: "https://cytktlrbanxiswqurqth.supabase.co/storage/v1/object/public/images/menu_images/1/20250311221294YSL4YWj4Ya84YSC4YWn4Ya34YSO4YW14YSP4YW14YarLTEwMjR4NjYxLmpwZw==",
        name: "",
        isUploaded: true
    });

    // 첫번째 텍스트 관련 상태
    const [primaryText, setPrimaryText] = useState({
        content: "텍스트를 입력하세요",
        position: {x: 50, y: 50},
        style: {
            fontSize: 35,
            color: "#ffffff",
            isEntered: false
        }
    });

    // 두번째 텍스트 관련 상태
    const [secondaryText, setSecondaryText] = useState({
        content: "두번째 텍스트를 입력하세요",
        position: {x: 70, y: 90},
        style: {
            fontSize: 20,
            color: "#ffffff",
            isEntered: false
        }
    });

    // 공통 텍스트 스타일 상태
    const [textStyle, setTextStyle] = useState({
        fontWeight: "normal",
        textAlign: "center",
        fontFamily: `${jua.style.fontFamily}`, // 기본값으로 Arial
        outline: {
            enabled: true,
            color: "#000000",
            width: 1
        }
    });

    const [fontSizeRatio, setFontSizeRatio] = useState(secondaryText.style.fontSize / primaryText.style.fontSize);

    // 단계 설정 상태
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 7; // 총 단계 수\

    // 스크롤 관련 상태
    const previewPanelRef = useRef(null);
    const [previewState, setPreviewState] = useState({
        // startPosition: 0,
        width: 0,
        // isFixed: false,
        // lastScrollPosition: 0
    });

    const thumbnailPreviewRef = useRef(null);

    // 글생성 관련 상태 추가 (기존 state 변수들 옆에 추가)
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedText, setGeneratedText] = useState(["글 생성 대기", "글 생성 대기"]);

    // 글 생성 과정에서 추가 옵션 사용 여부
    const [useInfo, setUseInfo] = useState(true); // 기본값 true
    const [useKeyword, setUseKeyword] = useState(true); // 기본값 true

    // 블로그 포스트 관련 상태
    const [blogPosts, setBlogPosts] = useState([]);
    const [selectedBlogs, setSelectedBlogs] = useState([]);

    // 포스팅 대기 관련 상태
    const [isPosting, setIsPosting] = useState(false);

    // 글 생성 확인 텍스트 관련 상태
    const [editableTexts, setEditableTexts] = useState([...generatedText]);
    const [selectedTextIndex, setSelectedTextIndex] = useState(0);
    const [editMode, setEditMode] = useState([false, false]);

    // 메뉴 이미지 개수 관련 상태 (제거예정)
    const [presetImageCount, setPresetImageCount] = useState(8);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                // const img =
                img.onload = function () {
                    // 4:5 비율로 크롭
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // 1:1 비율
                    // const size = Math.min(img.width, img.height);
                    // const startX = (img.width - size) / 2;
                    // const startY = (img.height - size) / 2;

                    // 4:5 비율 계산 (너비:높이 = 4:5)
                    let width, height, startX, startY;

                    if (img.width / img.height > 4 / 5) {
                        // 이미지가 더 넓은 경우
                        height = img.height;
                        width = height * (4 / 5);
                        startX = (img.width - width) / 2;
                        startY = 0;
                    } else {
                        // 이미지가 더 높은 경우
                        width = img.width;
                        height = width * (5 / 4);
                        startX = 0;
                        startY = (img.height - height) / 2;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, startX, startY, width, height, 0, 0, width, height);

                    setImage({
                        src: canvas.toDataURL('image/png'),
                        name: file.name,
                        isUploaded: true
                    });
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };


    // 메뉴 이미지 선택 처리 함수
    const handlePresetImageSelect = (imageUrl) => {
        // 새 이미지 객체 생성
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // CORS 이슈 방지

        // 이미지가 로드되면 실행할 함수
        img.onload = function () {
            // 기존 크롭 함수와 동일하게 4:5 비율로 크롭
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 4:5 비율 계산 (너비:높이 = 4:5)
            let width, height, startX, startY;

            if (img.width / img.height > 4 / 5) {
                // 이미지가 더 넓은 경우
                height = img.height;
                width = height * (4 / 5);
                startX = (img.width - width) / 2;
                startY = 0;
            } else {
                // 이미지가 더 높은 경우
                width = img.width;
                height = width * (5 / 4);
                startX = 0;
                startY = (img.height - height) / 2;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, startX, startY, width, height, 0, 0, width, height);

            setImage({
                src: canvas.toDataURL('image/png'),
                name: `preset-image-${Date.now()}.png`,
                isUploaded: true
            });
        };

        // 이미지 로드 에러 처리
        img.onerror = function () {
            console.error('이미지 로드 중 오류 발생');
        };

        // 이미지 소스 설정하여 로딩 시작
        img.src = imageUrl;
    };


    const handlePrimaryTextInput = (e) => {
        // const value = e.target.value.trim();
        const value = e.target.value;
        setPrimaryText(prev => ({
            ...prev,
            content: value || "텍스트를 입력하세요",
            style: {
                ...prev.style,
                isEntered: value.length > 0
            }
        }));
    };

    // 다운로드 버튼 상태 확인
    const isDownloadEnabled = () => {
        return image.isUploaded && primaryText.style.isEntered && secondaryText.style.isEntered;
    };

    // 두번째 텍스트 입력 처리
    const handleSecondaryTextInput = (e) => {
        // const value = e.target.value.trim();
        const value = e.target.value;
        setSecondaryText(prev => ({
            ...prev,
            content: value || "두번째 텍스트를 입력하세요",
            style: {
                ...prev.style,
                isEntered: value.length > 0
            }
        }));
    };

    // 텍스트 위치 조정 처리
    // 텍스트 위치 상단, 중단, 하단 값 지정
    const fixedPositions = {'top': 30, 'middle': 50, 'bottom': 65};
    const handlePositionChange = (position, isSecondary = false) => {
        // const fixedPositions = {'top': 20, 'middle': 50, 'bottom': 70};
        setPrimaryText(prev => ({
            ...prev,
            position: {
                x: 50,
                y: fixedPositions[position]
            }
        }));
    };

    // 폰트 크기 조정
    const handleFontSizeChange = (value) => {
        // 빈 문자열이면 기본값 사용
        if (value === '') {
            const defaultFontSize = 35;
            setPrimaryText(prev => ({
                ...prev,
                style: {
                    ...prev.style,
                    fontSize: defaultFontSize
                }
            }));
            setSecondaryText(prev => ({
                ...prev,
                style: {
                    ...prev.style,
                    fontSize: defaultFontSize * fontSizeRatio
                }
            }));
            return;
        }

        // parseInt 결과가 NaN인지 확인
        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) {
            return; // NaN이면 상태 업데이트 하지 않음
        }

        setPrimaryText(prev => ({
            ...prev,
            style: {
                ...prev.style,
                fontSize: numValue
            }
        }));
        setSecondaryText(prev => ({
            ...prev,
            style: {
                ...prev.style,
                fontSize: numValue * fontSizeRatio
            }
        }));
    };


    // 폰트 색상 변경
    const handleFontColorChange = (color, isSecondary = false) => {
        if (isSecondary) {
            setSecondaryText(prev => ({
                ...prev,
                style: {
                    ...prev.style,
                    color
                }
            }));
        } else {
            setPrimaryText(prev => ({
                ...prev,
                style: {
                    ...prev.style,
                    color
                }
            }));
        }
    };

    // 공통 스타일 변경
    const handleCommonStyleChange = (property, value) => {
        setTextStyle(prev => ({
            ...prev,
            [property]: value
        }));
    };

    // 테두리 설정 변경 (안쓰임)
    // const handleOutlineChange = (enabled) => {
    //   setTextStyle(prev => ({
    //     ...prev,
    //     outline: {
    //       ...prev.outline,
    //       enabled
    //     }
    //   }));
    // };

    // 테두리 속성 변경
    const handleOutlinePropertyChange = (property, value) => {
        setTextStyle(prev => ({
            ...prev,
            outline: {
                ...prev.outline,
                [property]: value
            }
        }));
    };

    // 그림자 스타일 생성 함수
    const getTextShadowStyle = () => {
        // if (textStyle.outline.enabled) {  // enabled true 긴한데 그냥 제거

        const width = textStyle.outline.width;
        const color = textStyle.outline.color;

        // 16방향 테두리
        return `${width}px 0 ${color},
              ${width * 0.7071}px ${width * 0.7071}px ${color},
              0 ${width}px ${color},
              -${width * 0.7071}px ${width * 0.7071}px ${color},
              -${width}px 0 ${color},
              -${width * 0.7071}px -${width * 0.7071}px ${color},
              0 -${width}px ${color},
              ${width * 0.7071}px -${width * 0.7071}px ${color},
              ${width * 0.3827}px ${width * 0.9239}px ${color},
              -${width * 0.3827}px ${width * 0.9239}px ${color},
              -${width * 0.9239}px ${width * 0.3827}px ${color},
              -${width * 0.9239}px -${width * 0.3827}px ${color},
              -${width * 0.3827}px -${width * 0.9239}px ${color},
              ${width * 0.3827}px -${width * 0.9239}px ${color},
              ${width * 0.9239}px -${width * 0.3827}px ${color},
              ${width * 0.9239}px ${width * 0.3827}px ${color}`;

        // }
        // return 'none';
    };

    // 텍스트 스타일 계산
    const getTextStyle = (isSecondary = false) => {
        // 현재 프리뷰 컨테이너의 너비 가져오기
        const previewWidth = thumbnailPreviewRef.current ? thumbnailPreviewRef.current.offsetWidth : 448;
        // 기준 너비(448px)에 대한 비율 계산 (max-w-md)
        const scaleFactor = previewWidth / 448;

        const baseFontSize = isSecondary ? secondaryText.style.fontSize : primaryText.style.fontSize;
        const scaledFontSize = Math.round(baseFontSize * scaleFactor);

        if (isSecondary) {
            return {
                position: 'absolute',
                left: '50%',
                top: `calc(${primaryText.position.y}% + ${scaledFontSize * 1.5}px)`,
                transform: 'translate(-50%, 0)',
                fontSize: `${scaledFontSize}px`,
                color: secondaryText.style.color,
                fontWeight: textStyle.fontWeight,
                textAlign: 'center',
                fontFamily: textStyle.fontFamily,
                width: '100%',
                lineHeight: '1.2',
                textShadow: getTextShadowStyle(),
                whiteSpace: 'pre-wrap',
                pointerEvents: 'none'
            };
        } else {
            return {
                position: 'absolute',
                left: '50%',
                top: `${primaryText.position.y}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: `${scaledFontSize}px`,
                color: primaryText.style.color,
                fontWeight: textStyle.fontWeight,
                textAlign: 'center',
                fontFamily: textStyle.fontFamily,
                width: '100%',
                lineHeight: '1.5',
                textShadow: getTextShadowStyle(),
                whiteSpace: 'pre-wrap',
                pointerEvents: 'none'
            };
        }
    };

    const handleResize = () => {
        if (!previewPanelRef.current) return;

        // requestAnimationFrame을 사용하여 렌더링 사이클에 맞춰 실행
        requestAnimationFrame(() => {
            if (!previewPanelRef.current) return;

            setPreviewState(prev => ({
                ...prev,
                width: previewPanelRef.current.offsetWidth,
                startPosition: previewPanelRef.current.parentElement.offsetTop,
            }));
        });
    };


    const handleTextUpdate = (updatedTexts) => {
        setGeneratedText(updatedTexts);
    }

    // 스크롤 관련
    useEffect(() => {

        const fetchMenus = async () => {
            const {data} = await supabaseClient.from('business_data').select("*").eq('id', 1);
            setBusiness(data)
        }
        fetchMenus()

        if (typeof window === 'undefined') return;

        // 초기 위치 및 너비 설정
        if (previewPanelRef.current) {
            setPreviewState({
                width: previewPanelRef.current.clientWidth,
            });
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [previewState.isFixed, previewState.width]); // previewState.isFixed 변경시 재실행

    // 단계 이동
    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // 다운로드 기능
    const downloadThumbnail = () => {

        // 원본 텍스트 위치 저장 (하드 코딩으로 일단 위치 문제 임시 수정)
        const originalPrimaryY = primaryText.position.y;
        const originalSecondaryY = secondaryText.position.y;
        // const originalSecondaryY = secondaryText.position.y;

        // 텍스트 위치 5% 위로 조정
        setPrimaryText(prev => ({
            ...prev,
            position: {
                ...prev.position,
                y: prev.position.y - 5 // 5% 위로 이동
            }
        }));

        setTimeout(() => {
            if (typeof window !== 'undefined' && window.html2canvas) {
                window.html2canvas(thumbnailPreviewRef.current, {
                    allowTaint: true,
                    useCORS: true,
                    scale: 4,
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = 'thumbnail.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();

                    // 다운로드 후 원래 위치로 복원
                    setPrimaryText(prev => ({
                        ...prev,
                        position: {
                            ...prev.position,
                            y: originalPrimaryY
                        }
                    }));
                });
            }
        }, 100); // 상태 업데이트하고 렌더링 시간 찔끔
    };

    // const handleGenerateText = () => {
    //     // 로딩 상태 시작
    //     setIsGenerating(true);
    //
    //     // 실제 API 호출 또는 setTimeout으로 지연 시간 시뮬레이션
    //     setTimeout(() => {
    //         // 텍스트 생성이 완료됨 (실제로는 API 응답을 받는 부분)
    //         const newText = "생성된 텍스트 결과입니다. 실제로는 API 응답이 여기에 표시됩니다.";
    //         setGeneratedText(newText);
    //         setIsGenerating(false); // 로딩 상태 종료
    //     }, 3000); // 3초 지연 시뮬레이션
    // };


    const fetchBlogPosts = async (keyword) => {
        setIsGenerating(true);
        try {
            // 경로가 정확한지 확인하세요
            const response = await fetch(`/api/search-blogs?query=${encodeURIComponent(keyword)}`);

            if (!response.ok) {
                throw new Error(`HTTP 오류! 상태: ${response.status}`);
            }

            const data = await response.json();
            console.log('블로그 검색 결과:', data);

            if (data && data.items) {
                setBlogPosts(data.items);
            }
        } catch (error) {
            console.error('블로그 검색 오류:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleTextChange = (index, newText) => {
        const updatedTexts = [...editableTexts];
        updatedTexts[index] = newText;
        setEditableTexts(updatedTexts);
    };

    // 편집 모드 토글 함수
    const toggleEditMode = (index) => {
        const newEditMode = [...editMode];
        newEditMode[index] = !newEditMode[index];
        setEditMode(newEditMode);
    };

    // 텍스트 선택 처리 함수
    const handleSelectText = (index) => {
        setSelectedTextIndex(index);
    };

    // 5단계 진입 시 블로그 데이터 가져오기
    useEffect(() => {
        if (currentStep === 5) {
            fetchBlogPosts(business[0].address.split(" ")[1] + " " + business[0].name);
        }
    }, [currentStep]);

    useEffect(() => {
        setEditableTexts([...generatedText]);
    }, [generatedText]);


    return (
        <Manage>
            <Head>
                <link rel="stylesheet" href="/fonts/fonts.css"/>
            </Head>

            <Script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js" strategy="afterInteractive"/>

            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6">

                        {/* 진행 단계 표시 - 개선된 디자인 */}
                        <div className="flex items-center justify-between mb-8 px-2">
                            {[1, 2, 3, 4, 5, 6, 7].map(step => (
                                <div key={step} className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2
                                ${currentStep === step ? 'bg-indigo-600 text-white' :
                                        currentStep > step ? 'bg-indigo-200 text-indigo-700' : 'bg-gray-200 text-gray-600'}`}>
                                        {step}
                                    </div>
                                    <span className="text-xs hidden md:block text-gray-600">
                                        {step === 1 && "이미지"}
                                        {step === 2 && "텍스트"}
                                        {step === 3 && "폰트"}
                                        {step === 4 && "위치"}
                                        {step === 5 && "옵션"}
                                        {step === 6 && "결과"}
                                        {step === 7 && "미리보기"}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden h-full">
                            {/* 왼쪽 패널: 설정 영역 */}
                            <div
                                className={`${currentStep >= 5 ? 'w-full' : 'w-full md:w-1/2'} p-6 border border-gray-100 rounded-lg overflow-y-auto`}>
                                <AnimatePresence mode="wait">
                                    {currentStep === 1 && (
                                        <ImageUploadStep
                                            key="step1"
                                            image={image}
                                            handleImageUpload={handleImageUpload}
                                            handlePresetImageSelect={handlePresetImageSelect}
                                            presetImageCount={presetImageCount}
                                        />
                                    )}

                                    {currentStep === 2 && (
                                        <TextInputStep
                                            key="step2"
                                            primaryText={primaryText}
                                            secondaryText={secondaryText}
                                            handlePrimaryTextInput={handlePrimaryTextInput}
                                            handleSecondaryTextInput={handleSecondaryTextInput}
                                        />
                                    )}

                                    {currentStep === 3 && (
                                        <FontSettingsStep
                                            key="step3"
                                            textStyle={textStyle}
                                            primaryText={primaryText}
                                            secondaryText={secondaryText}
                                            handleFontSizeChange={handleFontSizeChange}
                                            handleFontColorChange={handleFontColorChange}
                                            handleCommonStyleChange={handleCommonStyleChange}
                                            handleOutlinePropertyChange={handleOutlinePropertyChange}
                                            notoSansKr={notoSansKr}
                                            nanumGothic={nanumGothic}
                                            ibmPlexSansKr={ibmPlexSansKr}
                                            blackHanSans={blackHanSans}
                                            jua={jua}
                                        />
                                    )}

                                    {currentStep === 4 && (
                                        <PositionSettingsStep
                                            key="step4"
                                            primaryText={primaryText}
                                            handlePositionChange={handlePositionChange}
                                            fixedPositions={fixedPositions}
                                        />
                                    )}

                                    {currentStep === 5 && (
                                        <OptionsPage
                                            generatedText={generatedText}
                                            useInfo={useInfo}
                                            setUseInfo={setUseInfo}
                                            useKeyword={useKeyword}
                                            setUseKeyword={setUseKeyword}
                                            blogPosts={blogPosts}
                                            selectedBlogs={selectedBlogs}
                                            setSelectedBlogs={setSelectedBlogs}
                                            fetchBlogPosts={fetchBlogPosts}
                                        />
                                    )}

                                    {currentStep === 6 && (
                                        <ResultsPage
                                            generatedText={generatedText}
                                            isGenerating={isGenerating}
                                            editableTexts={editableTexts}
                                            selectedTextIndex={selectedTextIndex}
                                            editMode={editMode}
                                            onTextChange={handleTextChange}
                                            onToggleEditMode={toggleEditMode}
                                            onSelectText={handleSelectText}
                                        />
                                    )}

                                    {currentStep === 7 && (
                                        <TextPreviewStep
                                            editableTexts={editableTexts}
                                            selectedTextIndex={selectedTextIndex}
                                            image={image}
                                            thumbnailPreviewRef={thumbnailPreviewRef}
                                            getTextStyle={getTextStyle}
                                            primaryText={primaryText}
                                            secondaryText={secondaryText}
                                            previewPanelRef={previewPanelRef}
                                            isPosting={isPosting}
                                        />
                                    )}
                                </AnimatePresence>

                                {/* 네비게이션 버튼 */}
                                {business[0] != undefined &&
                                    <div className="mt-8 border-t pt-6 border-gray-100">
                                        <StepNavigation
                                            currentStep={currentStep}
                                            totalSteps={totalSteps}
                                            onNext={nextStep}
                                            onPrev={prevStep}
                                            onComplete={downloadThumbnail}
                                            isDownloadEnabled={isDownloadEnabled}
                                            setGeneratedText={setGeneratedText}
                                            editableTexts={editableTexts}
                                            selectedTextIndex={selectedTextIndex}
                                            isGenerating={isGenerating}
                                            setIsGenerating={setIsGenerating}
                                            isPosting={isPosting}
                                            setIsPosting={setIsPosting}
                                            useInfo={useInfo}
                                            useKeyword={useKeyword}
                                            selectedBlogs={selectedBlogs}
                                            b_name={business[0].name}
                                            b_address={business[0].address}
                                            b_time={business[0].time}
                                            b_number={business[0].number}
                                            b_description={business[0].description}
                                        />
                                    </div>
                                }
                            </div>

                            {/* 오른쪽 패널: 미리보기 */}
                            {currentStep < 5 && (
                                <div className="w-full md:w-1/2 p-6 bg-gray-50">
                                    <div
                                        ref={previewPanelRef}
                                        className="sticky top-5 md:static"
                                    >
                                        <h3 className="text-lg font-medium text-gray-700 mb-4">미리보기</h3>
                                        <div
                                            className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 shadow-inner flex items-center justify-center">
                                            <div
                                                className="relative w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-xl transform transition-all hover:scale-[1.02]"
                                                style={{aspectRatio: '4/5'}}>
                                                <div ref={thumbnailPreviewRef}
                                                     className="relative overflow-hidden w-full h-full">
                                                    <img
                                                        src={image.src}
                                                        alt="썸네일 이미지"
                                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                                    />
                                                    <div style={getTextStyle(false)}>{primaryText.content}</div>
                                                    <div style={getTextStyle(true)}>{secondaryText.content}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Manage>

    );
}


// 1단계 이미지 입력
const ImageUploadStep = ({image, handleImageUpload, handlePresetImageSelect, presetImageCount = 4}) => {
    const [selectedPresetIndex, setSelectedPresetIndex] = useState(null);

    const presetImages = Array(presetImageCount).fill().map((_, index) =>
        `https://picsum.photos/800/1000?random=${index + 1}`
    );

    const handleImageSelect = (imgSrc, index) => {
        setSelectedPresetIndex(index);
        handlePresetImageSelect(imgSrc);
    };

    return (
        <motion.div
            initial={{x: 300, opacity: 0}}
            animate={{x: 0, opacity: 1}}
            exit={{x: -300, opacity: 0}}
            transition={{duration: 0.5}}
            className="p-4 bg-white rounded-xl shadow-sm"
        >
            <h4 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">이미지 선택</h4>

            {/* 이미지 업로드 영역 */}
            <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-3">직접 이미지 업로드</label>
                <div className="flex items-center justify-center w-full">
                    <label
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 rounded-xl cursor-pointer transition duration-300 transform hover:scale-[1.02]">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-12 h-12 text-indigo-500 mb-3" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p className="text-sm text-indigo-600 font-medium">클릭하여 이미지 업로드</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF 파일 (최대 10MB)</p>
                        </div>
                        <input id="image-upload" type="file" className="hidden" accept="image/*"
                               onChange={handleImageUpload}/>
                    </label>
                </div>
                {image.name && (
                    <div className="mt-3 flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>{image.name}</span>
                    </div>
                )}
            </div>

            {/* 프리셋 이미지 선택 영역 */}
            <div className="mt-8">
                <label className="block text-gray-700 font-medium mb-3">또는 샘플 이미지 선택</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {presetImages.map((imgSrc, index) => (
                        <div
                            key={index}
                            className={`aspect-square relative overflow-hidden rounded-xl border-2 transition-all cursor-pointer
                                ${selectedPresetIndex === index
                                ? 'ring-4 ring-indigo-500 border-indigo-500'
                                : 'border-gray-200 hover:border-indigo-300'}`}
                            onClick={() => handleImageSelect(imgSrc, index)}
                            role="radio"
                            aria-checked={selectedPresetIndex === index}
                            tabIndex={0}
                        >
                            <img
                                src={imgSrc}
                                alt={`프리셋 이미지 ${index + 1}`}
                                className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                            <div className="absolute top-2 right-2">
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center border shadow-md
                                    ${selectedPresetIndex === index
                                    ? 'bg-indigo-600 border-indigo-600'
                                    : 'bg-white border-gray-300'}`}>
                                    {selectedPresetIndex === index && (
                                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};


// 2단계 텍스트 입력
const TextInputStep = ({primaryText, secondaryText, handlePrimaryTextInput, handleSecondaryTextInput}) => (
    <motion.div
        initial={{x: 300, opacity: 0}}
        animate={{x: 0, opacity: 1}}
        exit={{x: -300, opacity: 0}}
        transition={{duration: 0.5}}
        className="p-4 bg-white rounded-xl shadow-sm"
    >
        <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">텍스트 입력</h3>

        {/* 메인 텍스트 입력 */}
        <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">메인 텍스트</label>
            <div className="relative">
                <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                    rows="4"
                    placeholder="메인 텍스트를 입력하세요"
                    value={primaryText.content === "텍스트를 입력하세요" ? "" : primaryText.content}
                    onChange={handlePrimaryTextInput}
                ></textarea>
                <div className="absolute right-2 bottom-2 text-xs text-gray-400">
                    {primaryText.content.length} / 100
                </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">이미지 상단에 표시될 주요 텍스트입니다.</p>
        </div>

        {/* 서브 텍스트 입력 */}
        <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">서브 텍스트</label>
            <div className="relative">
                <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                    rows="3"
                    placeholder="서브 텍스트를 입력하세요"
                    value={secondaryText.content === "두번째 텍스트를 입력하세요" ? "" : secondaryText.content}
                    onChange={handleSecondaryTextInput}
                ></textarea>
                <div className="absolute right-2 bottom-2 text-xs text-gray-400">
                    {secondaryText.content.length} / 200
                </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">메인 텍스트 아래에 작게 표시될 추가 정보입니다.</p>
        </div>
    </motion.div>
);


// 3단계 폰트 설정
const FontSettingsStep = ({
                              textStyle,
                              primaryText,
                              secondaryText,
                              handleFontSizeChange,
                              handleFontColorChange,
                              handleCommonStyleChange,
                              handleOutlinePropertyChange,
                              notoSansKr,
                              nanumGothic,
                              ibmPlexSansKr,
                              blackHanSans,
                              jua
                          }) => (
    <motion.div
        initial={{x: 300, opacity: 0}}
        animate={{x: 0, opacity: 1}}
        exit={{x: -300, opacity: 0}}
        transition={{duration: 0.5}}
    >
        <h3 className="text-xl font-semibold mb-4">3. 폰트 설정</h3>

        {/* 폰트 크기 */}
        <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1" htmlFor="font-size">폰트 크기</label>
            <div className="flex items-center">
                <input
                    type="range"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    min="8"
                    max="72"
                    value={primaryText.style.fontSize}
                    onChange={(e) => handleFontSizeChange(e.target.value)}
                />
                <input
                    type="number"
                    className="ml-4 w-16 px-2 py-1 border border-gray-300 rounded text-center"
                    min="8"
                    max="72"
                    value={primaryText.style.fontSize}
                    onChange={(e) => handleFontSizeChange(e.target.value)}
                />
            </div>
        </div>

        {/* 폰트 색상 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-gray-700 text-sm mb-1" htmlFor="font-color">폰트 색상 1</label>
                <input
                    type="color"
                    className="h-10 w-full border border-gray-300 rounded cursor-pointer"
                    value={primaryText.style.color}
                    onChange={(e) => handleFontColorChange(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-gray-700 text-sm mb-1" htmlFor="font-color-2">폰트 색상 2</label>
                <input
                    type="color"
                    className="h-10 w-full border border-gray-300 rounded cursor-pointer"
                    value={secondaryText.style.color}
                    onChange={(e) => handleFontColorChange(e.target.value, true)}
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            {/* 폰트 선택 */}
            <div>
                <label className="block text-gray-700 text-sm mb-1" htmlFor="font-family">폰트</label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={textStyle.fontFamily}
                    onChange={(e) => handleCommonStyleChange('fontFamily', e.target.value)}
                >
                    <option value={`${jua.style.fontFamily}`}>Jua</option>
                    <option value={`${notoSansKr.style.fontFamily}`}>Noto Sans KR</option>
                    <option value={`${nanumGothic.style.fontFamily}`}>Nanum Gothic</option>
                    <option value={`${ibmPlexSansKr.style.fontFamily}`}>IBM Plex Sans KR</option>
                    <option value={`${blackHanSans.style.fontFamily}`}>Black Han Sans</option>
                </select>
            </div>

            {/* 폰트 굵기 */}
            <div>
                <label className="block text-gray-700 text-sm mb-1" htmlFor="font-weight">폰트 굵기</label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={textStyle.fontWeight}
                    onChange={(e) => handleCommonStyleChange('fontWeight', e.target.value)}
                >
                    <option value="normal">보통</option>
                    <option value="bold">굵게</option>
                    <option value="bolder">더 굵게</option>
                    <option value="lighter">얇게</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-1" htmlFor="outline-color">테두리 색상</label>
                <input
                    type="color"
                    className="h-10 w-full border border-gray-300 rounded cursor-pointer"
                    value={textStyle.outline.color}
                    onChange={(e) => handleOutlinePropertyChange('color', e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-1 mt-2" htmlFor="outline-width">테두리 두께</label>
                <div className="flex items-center">
                    <input
                        type="range"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        min="1"
                        max="5"
                        value={textStyle.outline.width}
                        onChange={(e) => handleOutlinePropertyChange('width', parseInt(e.target.value))}
                    />
                    <input
                        type="number"
                        className="ml-4 w-16 px-2 py-1 border border-gray-300 rounded text-center"
                        min="1"
                        max="5"
                        value={textStyle.outline.width}
                        onChange={(e) => handleOutlinePropertyChange('width', parseInt(e.target.value))}
                    />
                </div>
            </div>
        </div>
    </motion.div>
);

// 4단계 위치 설정
const PositionSettingsStep = ({
                                  primaryText,
                                  handlePositionChange,
                                  fixedPositions,
                                  textStyle,
                                  handleCommonStyleChange
                              }) => (
    <motion.div
        initial={{x: 300, opacity: 0}}
        animate={{x: 0, opacity: 1}}
        exit={{x: -300, opacity: 0}}
        transition={{duration: 0.5}}
        className="p-4 bg-white rounded-xl shadow-sm"
    >
        <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">텍스트 위치 설정</h3>

        <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-4">수직 위치</label>
            <div className="grid grid-cols-3 gap-4">
                {[
                    {
                        id: 'top',
                        label: '상단',
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <line x1="7" y1="7" x2="17" y2="7" strokeWidth="2"/>
                            </svg>
                        )
                    },
                    {
                        id: 'middle',
                        label: '중앙',
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <line x1="7" y1="12" x2="17" y2="12" strokeWidth="2"/>
                            </svg>
                        )
                    },
                    {
                        id: 'bottom',
                        label: '하단',
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <line x1="7" y1="17" x2="17" y2="17" strokeWidth="2"/>
                            </svg>
                        )
                    }
                ].map((position) => (
                    <div
                        key={position.id}
                        onClick={() => handlePositionChange(position.id)}
                        className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${primaryText.position.y === fixedPositions[position.id]
                            ? 'bg-indigo-100 border-indigo-500 shadow-md transform -translate-y-1'
                            : 'bg-white border-gray-200 hover:border-indigo-300'
                        }`}
                    >
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                            {position.icon}
                        </div>
                        <span className="font-medium">{position.label}</span>
                    </div>
                ))}
            </div>
        </div>
    </motion.div>
);


const OptionsPage = ({
                         generatedText,
                         useInfo,
                         setUseInfo,
                         useKeyword,
                         setUseKeyword,
                         blogPosts,
                         selectedBlogs,
                         setSelectedBlogs,
                         fetchBlogPosts
                     }) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = () => {
        if (searchKeyword.trim()) {
            setIsSearching(true);
            fetchBlogPosts(searchKeyword)
                .finally(() => setIsSearching(false));
        }
    };

    return (
        <div className="min-h-100 flex flex-col md:flex-row gap-6">
            {/* 왼쪽 패널: 콘텐츠 생성 옵션 + 블로그 참조 */}
            <div className="w-full md:w-2/5 flex flex-col gap-4">
                {/* 콘텐츠 생성 옵션 영역 - 상단 */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-3">콘텐츠 생성 옵션</h3>

                    <div className="space-y-4">
                        <div className="flex items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                            <label className="flex items-center cursor-pointer relative">
                                <input
                                    type="checkbox"
                                    checked={useInfo}
                                    onChange={(e) => setUseInfo(e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-indigo-600 checked:border-indigo-600"
                                />
                                <span
                                    className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5"
                                         viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                        <path fillRule="evenodd"
                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                              clipRule="evenodd"></path>
                                    </svg>
                                </span>
                            </label>
                            <div className="ml-3">
                                <label htmlFor="use-info" className="font-medium text-gray-700">
                                    기본 정보 사용
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    매장 이름, 위치, 영업시간 등 기본 정보를 콘텐츠 생성에 활용합니다.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                            <label className="flex items-center cursor-pointer relative">
                                <input
                                    type="checkbox"
                                    checked={useKeyword}
                                    onChange={(e) => setUseKeyword(e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-indigo-600 checked:border-indigo-600"
                                />
                                <span
                                    className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5"
                                         viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                        <path fillRule="evenodd"
                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                              clipRule="evenodd"></path>
                                    </svg>
                                </span>
                            </label>
                            <div className="ml-3">
                                <label htmlFor="use-keyword" className="font-medium text-gray-700">
                                    키워드 활용
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    검색 키워드를 분석하여 최적화된 콘텐츠를 생성합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 블로그 참조 영역 - 하단 */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-1">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-3">블로그 참조</h3>

                    <div className="mb-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="검색 키워드 입력"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                value={searchKeyword}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center disabled:bg-indigo-300"
                            >
                                {isSearching ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                         fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="max-h-[320px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {isSearching ? (
                            <div className="flex justify-center items-center p-6">
                                <div className="animate-pulse text-indigo-600">검색 중...</div>
                            </div>
                        ) : blogPosts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-6 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                                </svg>
                                <p>검색된 블로그가 없습니다.</p>
                                <p className="text-sm mt-1">다른 키워드로 검색해보세요.</p>
                            </div>
                        ) : (
                            blogPosts.map((blog, index) => (
                                <div
                                    key={index}
                                    className={`border rounded-lg p-3 cursor-pointer transition hover:shadow-md ${selectedBlogs.includes(blog.link)
                                        ? 'bg-indigo-50 border-indigo-300'
                                        : 'bg-white hover:bg-gray-50'
                                    }`}
                                    onClick={() => {
                                        if (selectedBlogs.includes(blog.link)) {
                                            setSelectedBlogs(selectedBlogs.filter(link => link !== blog.link));
                                        } else {
                                            setSelectedBlogs([...selectedBlogs, blog.link]);
                                        }
                                    }}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-1 pr-2">
                                            <h4 className="font-medium text-gray-800 mb-1"
                                                dangerouslySetInnerHTML={{__html: blog.title}}></h4>
                                            <p className="text-sm text-gray-600 line-clamp-2"
                                               dangerouslySetInnerHTML={{__html: blog.description}}></p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {blog.postdate.slice(0, 4) + "-" + blog.postdate.slice(4, 6) + "-" + blog.postdate.slice(6, 8)}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 ml-2">
                                            <div
                                                className={`h-6 w-6 rounded-full flex items-center justify-center border ${selectedBlogs.includes(blog.link)
                                                    ? 'bg-indigo-600 border-indigo-600'
                                                    : 'border-gray-300'
                                                }`}>
                                                {selectedBlogs.includes(blog.link) && (
                                                    <svg className="h-3 w-3 text-white" fill="currentColor"
                                                         viewBox="0 0 20 20">
                                                        <path fillRule="evenodd"
                                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* 오른쪽 패널: 블로그 미리보기 전체 영역 */}
            <div className="w-full md:w-3/5 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <h3 className="text-xl font-semibold p-5 border-b text-gray-800">블로그 미리보기</h3>

                <div className="relative w-full h-full">
                    {selectedBlogs.length > 0 ? (
                        <iframe
                            src={selectedBlogs.length > 0 ? selectedBlogs[selectedBlogs.length - 1].replace(/(https?:\/\/)/, '$1m.') : ''}
                            className="w-full h-full border-0"
                            title="블로그 미리보기"
                            sandbox="allow-same-origin allow-scripts"
                        ></iframe>
                    ) : (
                        <div className="flex flex-col items-center justify-center bg-gray-50 h-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <p className="text-gray-500 text-lg mb-2">블로그를 선택하면 미리보기가 표시됩니다</p>
                            <p className="text-gray-400 text-sm">왼쪽에서 참조할 블로그를 검색하고 선택해주세요</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const ResultsPage = ({
                         generatedText,
                         isGenerating,
                         editableTexts,
                         selectedTextIndex,
                         editMode,
                         onTextChange,
                         onToggleEditMode,
                         onSelectText
                     }) => {
    // 텍스트가 초기값인지 확인하는 함수
    const isDefaultText = (text) => {
        return text === "글 생성 대기" || text === "";
    };

    // 콘텐츠가 생성되었는지 확인
    const hasGeneratedContent = !isDefaultText(editableTexts[0]) || !isDefaultText(editableTexts[1]);

    return (
        <div className="min-h-100 flex flex-col space-y-4">
            {/* 안내 배너 - 콘텐츠 생성 전 */}
            {!hasGeneratedContent && !isGenerating && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                    <div className="flex justify-center items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className="text-blue-800 font-medium">콘텐츠 생성 안내</span>
                    </div>
                    <p className="text-blue-700">아래 "글 생성" 버튼을 클릭하여 AI 콘텐츠를 생성해주세요.</p>
                </div>
            )}

            {/* 선택 안내 - 콘텐츠 생성 후, 선택 전 */}
            {hasGeneratedContent && !isGenerating && selectedTextIndex === null && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                    <div className="flex justify-center items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                        <span className="text-green-800 font-medium">콘텐츠가 생성되었습니다!</span>
                    </div>
                    <p className="text-green-700">아래 두 결과 중 하나를 선택해주세요.</p>
                </div>
            )}

            {/* 로딩 상태 */}
            {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div
                        className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
                    <p className="text-lg text-gray-700 mb-2">AI가 콘텐츠를 생성하고 있습니다</p>
                    <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
                </div>
            ) : (
                <div className="flex justify-around w-full gap-6">
                    {/* 결과 1 */}
                    <div
                        className={`flex-1 bg-white p-4 rounded-lg shadow-md border-2 transition ${selectedTextIndex === 0
                            ? 'border-indigo-500 ring-2 ring-indigo-300'
                            : hasGeneratedContent && !isDefaultText(editableTexts[0])
                                ? 'border-gray-200 hover:border-indigo-300 cursor-pointer'
                                : 'border-gray-200'
                        }`}
                        onClick={() => {
                            if (!editMode[0] && !editMode[1] && !isDefaultText(editableTexts[0])) {
                                onSelectText(0);
                            }
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div
                                    className={`h-6 w-6 rounded-full flex items-center justify-center border mr-2 ${selectedTextIndex === 0
                                        ? 'bg-indigo-600 border-indigo-600'
                                        : 'border-gray-300'
                                    }`}>
                                    {selectedTextIndex === 0 && (
                                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    )}
                                </div>
                                <h3 className="font-medium text-gray-800">결과 1</h3>
                            </div>

                            <button
                                className={`px-4 py-1.5 text-sm rounded-full transition ${isDefaultText(editableTexts[0])
                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    : editMode[0]
                                        ? 'bg-green-500 text-white'
                                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isDefaultText(editableTexts[0])) onToggleEditMode(0);
                                }}
                                disabled={isDefaultText(editableTexts[0])}
                            >
                                {editMode[0] ? '저장' : '수정'}
                            </button>
                        </div>

                        {editMode[0] ? (
                            <div className="relative">
                                <textarea
                                    className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200 w-full h-[400px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={editableTexts[0]}
                                    onChange={(e) => onTextChange(0, e.target.value)}
                                ></textarea>
                                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                    {editableTexts[0].length} 자
                                </div>
                            </div>
                        ) : (
                            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg h-[400px] overflow-auto">
                                {isDefaultText(editableTexts[0]) ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                        </svg>
                                        <p className="text-lg">콘텐츠가 생성되지 않았습니다</p>
                                        <p className="text-sm mt-1">하단의 '글 생성' 버튼을 눌러주세요</p>
                                    </div>
                                ) : (
                                    <div>{editableTexts[0]}</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 결과 2 */}
                    <div
                        className={`flex-1 bg-white p-4 rounded-lg shadow-md border-2 transition ${selectedTextIndex === 1
                            ? 'border-indigo-500 ring-2 ring-indigo-300'
                            : hasGeneratedContent && !isDefaultText(editableTexts[1])
                                ? 'border-gray-200 hover:border-indigo-300 cursor-pointer'
                                : 'border-gray-200'
                        }`}
                        onClick={() => {
                            if (!editMode[0] && !editMode[1] && !isDefaultText(editableTexts[1])) {
                                onSelectText(1);
                            }
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div
                                    className={`h-6 w-6 rounded-full flex items-center justify-center border mr-2 ${selectedTextIndex === 1
                                        ? 'bg-indigo-600 border-indigo-600'
                                        : 'border-gray-300'
                                    }`}>
                                    {selectedTextIndex === 1 && (
                                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    )}
                                </div>
                                <h3 className="font-medium text-gray-800">결과 2</h3>
                            </div>

                            <button
                                className={`px-4 py-1.5 text-sm rounded-full transition ${isDefaultText(editableTexts[1])
                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    : editMode[1]
                                        ? 'bg-green-500 text-white'
                                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isDefaultText(editableTexts[1])) onToggleEditMode(1);
                                }}
                                disabled={isDefaultText(editableTexts[1])}
                            >
                                {editMode[1] ? '저장' : '수정'}
                            </button>
                        </div>

                        {editMode[1] ? (
                            <div className="relative">
                                <textarea
                                    className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200 w-full h-[400px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={editableTexts[1]}
                                    onChange={(e) => onTextChange(1, e.target.value)}
                                ></textarea>
                                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                    {editableTexts[1].length} 자
                                </div>
                            </div>
                        ) : (
                            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg h-[400px] overflow-auto">
                                {isDefaultText(editableTexts[1]) ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                        </svg>
                                        <p className="text-lg">콘텐츠가 생성되지 않았습니다</p>
                                        <p className="text-sm mt-1">하단의 '글 생성' 버튼을 눌러주세요</p>
                                    </div>
                                ) : (
                                    <div>{editableTexts[1]}</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 선택 확인 메시지 - 결과 선택 후 */}
            {selectedTextIndex !== null && hasGeneratedContent && !isGenerating && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center mt-4">
                    <div className="flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2"
                             viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"/>
                        </svg>
                        <span className="text-green-800 font-medium">
                            결과 {selectedTextIndex + 1}이(가) 선택되었습니다. 다음 단계로 진행하세요.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};


// 최종 미리보기 페이지
const TextPreviewStep = ({
                             editableTexts,
                             selectedTextIndex,
                             image,
                             thumbnailPreviewRef,
                             getTextStyle,
                             primaryText,
                             secondaryText,
                             previewPanelRef,
                             isPosting
                         }) => {
    const selectedText = editableTexts[selectedTextIndex];

    return (
        <motion.div
            initial={{x: 300, opacity: 0}}
            animate={{x: 0, opacity: 1}}
            exit={{x: -300, opacity: 0}}
            transition={{duration: 0.5}}
            className="min-h-100"
        >
            <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">최종 미리보기</h3>

            {/* 로딩 상태 */}
            {isPosting ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 min-h-[600px]">
                    <div
                        className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
                    <p className="text-lg text-gray-700 mb-2">Instagram에 게시하고 있습니다</p>
                    <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-8">
                    {/* 텍스트 미리보기 영역 */}
                    <div className="w-full md:w-1/2">
                        <div className="bg-white p-5 rounded-xl shadow-sm h-full">
                            <h4 className="text-lg font-medium mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600"
                                     fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                                선택된 텍스트
                            </h4>

                            <div
                                className="bg-gray-50 p-4 rounded-lg h-[550px] overflow-y-auto custom-scrollbar border border-gray-100">
                                {selectedText && selectedText !== "글 생성 대기" ? (
                                    <div className="whitespace-pre-wrap">{selectedText}</div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                                        </svg>
                                        <p>선택된 텍스트가 없습니다</p>
                                        <p className="text-sm mt-1">이전 단계에서 텍스트를 선택해주세요</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 이미지 미리보기 영역 */}
                    <div className="w-full md:w-1/2">
                        <div className="bg-white p-5 rounded-xl shadow-sm h-full">
                            <h4 className="text-lg font-medium mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600"
                                     fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                썸네일 미리보기
                            </h4>

                            <div ref={previewPanelRef}
                                 className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 shadow-lg flex items-center justify-center h-[550px]">
                                <div ref={thumbnailPreviewRef}
                                     className="relative overflow-hidden w-full max-w-sm h-full mx-auto shadow-2xl rounded-lg">
                                    <img
                                        src={image.src}
                                        alt="썸네일 이미지"
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                    />
                                    <div style={getTextStyle(false)}>{primaryText.content}</div>
                                    <div style={getTextStyle(true)}>{secondaryText.content}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};


const StepNavigation = ({
                            currentStep,
                            totalSteps,
                            onNext,
                            onPrev,
                            onComplete,
                            isDownloadEnabled,
                            isGenerating,
                            setIsGenerating,
                            setGeneratedText,
                            editableTexts,
                            selectedTextIndex,
                            isPosting,
                            setIsPosting,
                            useInfo,
                            useKeyword,
                            selectedBlogs,
                            b_name,
                            b_address,
                            b_time,
                            b_number,
                            b_description
                        }) => {

    return (
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
            {/* 이전 버튼 - 첫 단계가 아닌 경우 표시 */}
            {currentStep > 1 && (
                <button
                    onClick={onPrev}
                    className="px-5 py-2.5 flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all focus:ring-2 focus:ring-indigo-200 shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"/>
                    </svg>
                    이전
                </button>
            )}

            {/* 가운데 여백 또는 추가 기능을 위한 공간 */}
            <div className="flex-1"></div>

            {/* 단계별 특수 버튼 */}
            <div className="flex gap-3">
                {/* 4단계: 썸네일 다운로드 버튼 */}
                {currentStep === 4 && (
                    <button
                        onClick={onComplete}
                        disabled={!isDownloadEnabled()}
                        className={`px-5 py-2.5 flex items-center justify-center gap-2 rounded-lg transition ${isDownloadEnabled()
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-400 text-white cursor-not-allowed'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                  clipRule="evenodd"/>
                        </svg>
                        썸네일 다운로드
                    </button>
                )}

                {/* 6단계: 글 생성 버튼 */}
                {currentStep === 6 && (
                    <button
                        onClick={async () => {
                            setIsGenerating(true);
                            try {
                                const fetchPromise1 = fetch(
                                    `${process.env.NEXT_PUBLIC_GCP_API_URL}/generate?name=${b_name}&address=${b_address}&time=${b_time}&number=${b_number}&description=${b_description}&use_info=${useInfo}&use_keyword=${useKeyword}&blogs=${selectedBlogs.join(',')}`
                                ).then(response => response.json());

                                const fetchPromise2 = fetch(
                                    `${process.env.NEXT_PUBLIC_GCP_API_URL_2}/generate?name=${b_name}&address=${b_address}&time=${b_time}&number=${b_number}&description=${b_description}&use_info=${useInfo}&use_keyword=${useKeyword}&blogs=${selectedBlogs.join(',')}`
                                ).then(response => response.json());

                                const [result1, result2] = await Promise.all([fetchPromise1, fetchPromise2]);
                                setGeneratedText([result1.generated_content, result2.generated_content]);
                            } catch (error) {
                                console.error('Error fetching data:', error);
                            } finally {
                                setIsGenerating(false);
                            }
                        }}
                        disabled={isGenerating}
                        className={`px-5 py-2.5 flex items-center justify-center gap-2 rounded-lg transition ${isGenerating ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white`}
                    >
                        {isGenerating ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                글 생성 중...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                     fill="currentColor">
                                    <path fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd"/>
                                </svg>
                                글 생성
                            </>
                        )}
                    </button>
                )}

                {/* 7단계: 글 게시 버튼 */}
                {currentStep === 7 && (
                    <button
                        onClick={async () => {
                            setIsPosting(true); // 로딩 시작
                            try {
                                const response = await fetch('/api/instagram/upload', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        imageUrl: "https://cytktlrbanxiswqurqth.supabase.co/storage/v1/object/public/images/menu_images/1/2025031122556MTI3MTQ3ODg5c2lxby5qcGc=",
                                        caption: editableTexts[selectedTextIndex]
                                    })
                                })

                                const data = await response.json()

                                if (data.success) {
                                    alert("Instagram에 성공적으로 게시되었습니다!");
                                } else {
                                    alert("게시 실패: " + data.error);
                                }
                            } catch (error) {
                                alert("게시 중 오류가 발생했습니다: " + error.message);
                            } finally {
                                setIsPosting(false); // 로딩 종료
                            }
                        }}
                        disabled={isPosting}
                        className={`px-5 py-2.5 flex items-center justify-center gap-2 rounded-lg transition-all ${
                            isPosting
                                ? 'bg-green-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                    >
                        {isPosting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Instagram에 게시 중...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                     fill="currentColor">
                                    <path fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd"/>
                                </svg>
                                Instagram에 게시하기
                            </>
                        )}
                    </button>
                )}


                {/* 다음 버튼 - 마지막 단계가 아닌 경우 표시 */}
                {currentStep < totalSteps && (
                    <button
                        onClick={onNext}
                        className="px-5 py-2.5 flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md"
                    >
                        다음
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"/>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};