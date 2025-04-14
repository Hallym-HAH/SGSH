'use client'

import Manage from "../page";
import ManageNavBar from "@/components/feature/manage_navbar";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import Head from 'next/head';
import { Noto_Sans_KR, Nanum_Gothic, IBM_Plex_Sans_KR, Black_Han_Sans, Jua } from 'next/font/google';

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
    // 글 생성 데이터
    const [generatedData, setGeneratedData] = useState();


    // 이미지 관련 상태
    const [image, setImage] = useState({
        src: "https://placehold.co/448x448/000000/000000/png",
        name: "",
        isUploaded: false
    });

    // 첫번째 텍스트 관련 상태
    const [primaryText, setPrimaryText] = useState({
        content: "텍스트를 입력하세요",
        position: { x: 50, y: 50 },
        style: {
            fontSize: 35,
            color: "#ffffff",
            isEntered: false
        }
    });

    // 두번째 텍스트 관련 상태
    const [secondaryText, setSecondaryText] = useState({
        content: "두번째 텍스트를 입력하세요",
        position: { x: 70, y: 90 },
        style: {
            fontSize: 20,
            color: "#ffffff",
            isEntered: false
        }
    });

    // 공통 텍스트 스타일 상태
    const [textStyle, setTextStyle] = useState({
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Arial, sans-serif", // 기본값으로 Arial
        outline: {
            color: "#000000",
            width: 1
        }
    });

    const [fontSizeRatio, setFontSizeRatio] = useState(secondaryText.style.fontSize / primaryText.style.fontSize);

    // 단계 설정 상태
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4; // 총 단계 수\

    // 스크롤 관련 상태
    const previewPanelRef = useRef(null);
    const [previewState, setPreviewState] = useState({
        width: 0,
    });

    const thumbnailPreviewRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
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
    const fixedPositions = { 'top': 30, 'middle': 50, 'bottom': 65 };
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
                top: `calc(${primaryText.position.y}% + ${scaledFontSize * 2.0}px)`,
                transform: 'translate(-50%, -50%)',
                fontSize: `${scaledFontSize}px`,
                color: secondaryText.style.color,
                fontWeight: textStyle.fontWeight,
                textAlign: 'center',
                fontFamily: textStyle.fontFamily,
                width: '100%',
                lineHeight: '1.5',
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

    // 스크롤 관련
    useEffect(() => {

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
    }, [previewState.width]);

    // 단계 이동
    const nextStep = () => {
        if (currentStep < 4) {
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

    return (
        <Manage>
            <Head>
                <title>썸네일 생성기</title>
                <link rel="stylesheet" href="/fonts/fonts.css" />
            </Head>

            <Script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js" strategy="beforeInteractive" />

            <div className="w-full md:ml-64">
                <ManageNavBar />
                <div className="p-4">
                    <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                        <h2>홍보글 생성 페이지</h2>

                        <div className="container mx-auto px-4 py-8 max-w-6xl">
                            <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700"></h1>

                            <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
                                {/* 왼쪽 패널 : 설정들 */}
                                <div className="w-full md:w-1/2 p-6 md:border-r border-gray-200 overflow-y-auto">
                                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">설정</h2>

                                    {/* 단계 표시 */}
                                    <div className="flex mb-6">
                                        {[1, 2, 3, 4].map(step => (
                                            <div
                                                key={step}
                                                className={`w-1/4 h-2 mx-1 rounded ${currentStep >= step ? 'bg-indigo-500' : 'bg-gray-200'}`}
                                            />
                                        ))}
                                    </div>

                                    {/* 단계별 컴포넌트 */}
                                    <AnimatePresence mode="wait">
                                        {currentStep === 1 && (
                                            <ImageUploadStep
                                                key="step1"
                                                image={image}
                                                handleImageUpload={handleImageUpload}
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
                                    </AnimatePresence>
                                    {/* 네비게이션 버튼 */}
                                    <StepNavigation
                                        currentStep={currentStep}
                                        totalSteps={4}
                                        onNext={nextStep}
                                        onPrev={prevStep}
                                        onComplete={downloadThumbnail}
                                        isDownloadEnabled={isDownloadEnabled}
                                    />
                                </div>

                                {/* 오른쪽 패널: 미리보기 */}
                                <div className="w-full md:w-1/2 p-6 bg-gray-50">
                                    <div
                                        ref={previewPanelRef}
                                        className="sticky top-5 max-h-[90vh] md:static md:max-h-full"
                                    >
                                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">미리보기</h2>
                                        <div className="bg-gray-800 rounded-xl p-2 shadow-inner flex items-center justify-center">
                                            <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-lg" style={{ aspectRatio: '4/5' }}>
                                                <div ref={thumbnailPreviewRef} className="relative overflow-hidden w-full h-full">

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

                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </Manage >
    );
}

// 1단계 이미지 입력
const ImageUploadStep = ({ image, handleImageUpload }) => (
    <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.5 }}
    >
        <h3 className="text-xl font-semibold mb-4">1. 이미지 업로드</h3>
        {/* 이미지 업로드 관련 UI */}
        <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">이미지 업로드</label>
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 rounded-lg cursor-pointer transition duration-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 text-indigo-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="text-sm text-indigo-600">이미지를 업로드하세요</p>
                    </div>
                    <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
            </div>
            <p className="mt-2 text-sm text-gray-500">{image.name}</p>
        </div>
    </motion.div>
);

// 2단계 텍스트 입력
const TextInputStep = ({ primaryText, secondaryText, handlePrimaryTextInput, handleSecondaryTextInput }) => (
    <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.5 }}
    >
        <h3 className="text-xl font-semibold mb-4">2. 텍스트 입력</h3>

        {/* 첫 번째 텍스트 입력 */}
        <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">메인 텍스트</label>
            <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                rows="3"
                placeholder="텍스트를 입력하세요"
                value={primaryText.content === "텍스트를 입력하세요" ? "" : primaryText.content}
                onChange={handlePrimaryTextInput}
            ></textarea>
        </div>

        {/* 두번째 텍스트 입력 */}
        <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">서브 텍스트</label>
            <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                rows="3"
                placeholder="두번째 텍스트를 입력하세요"
                value={secondaryText.content === "두번째 텍스트를 입력하세요" ? "" : secondaryText.content}
                onChange={handleSecondaryTextInput}
            ></textarea>
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
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.5 }}
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
                    <option value="Arial, sans-serif">Arial</option>
                    <option value={`${notoSansKr.style.fontFamily}`}>Noto Sans KR</option>
                    <option value={`${nanumGothic.style.fontFamily}`}>Nanum Gothic</option>
                    <option value={`${ibmPlexSansKr.style.fontFamily}`}>IBM Plex Sans KR</option>
                    <option value={`${blackHanSans.style.fontFamily}`}>Black Han Sans</option>
                    <option value={`${jua.style.fontFamily}`}>Jua</option>
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
const PositionSettingsStep = ({ primaryText, handlePositionChange, fixedPositions }) => (
    <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.5 }}
    >
        <h3 className="text-xl font-semibold mb-4">4. 위치 설정</h3>

        <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2">텍스트 위치</label>
            <div className="flex justify-between gap-2">
                <button
                    className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 flex flex-col items-center ${primaryText.position.y === fixedPositions['top'] ? 'bg-indigo-500 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    onClick={() => handlePositionChange('top')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <line x1="8" y1="8" x2="16" y2="8" />
                    </svg>
                    <span className="text-xs">상단</span>
                </button>

                <button
                    className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 flex flex-col items-center ${primaryText.position.y === fixedPositions['middle'] ? 'bg-indigo-500 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    onClick={() => handlePositionChange('middle')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    <span className="text-xs">중앙</span>
                </button>

                <button
                    className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 flex flex-col items-center ${primaryText.position.y === fixedPositions['bottom'] ? 'bg-indigo-500 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    onClick={() => handlePositionChange('bottom')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <line x1="8" y1="16" x2="16" y2="16" />
                    </svg>
                    <span className="text-xs">하단</span>
                </button>
            </div>
        </div>
    </motion.div>
);


const StepNavigation = ({ currentStep, totalSteps, onNext, onPrev, onComplete, isDownloadEnabled }) => (
    <div className="flex justify-between mt-6">
        {currentStep > 1 && (
            <button
                onClick={onPrev}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
                이전
            </button>
        )}
        {currentStep < totalSteps && (
            <button
                onClick={onNext}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition ml-auto"
            >
                다음
            </button>
        )}
        {currentStep === totalSteps && (
            <button
                onClick={onComplete}
                disabled={!isDownloadEnabled()}
                className={`px-4 py-2 rounded-lg transition ml-auto ${isDownloadEnabled()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
            >
                완료
            </button>
        )}
        {currentStep === totalSteps && (
            <button onClick={async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_GCP_API_URL}/generate?name=진스키친&address=춘천&time=12시&number=010-1111-2222&description=춘천+양식+맛집`);
                    const result = await response.json();
                    console.log(result);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }} className={`px-4 py-2 rounded-lg transition ml-auto bg-green-600 text-white hover:bg-green-700}`}>
                글생성
            </button>
        )}

    </div>
);