'use client'
import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import Image from "next/image";
import Header from '@/components/Header';
import { HexColorPicker } from "react-colorful";

export default function Home() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<number | null>(null);
    const [activeInstrument, setActiveInstrument] = useState<number | null>(null);
    const [texts, setTexts] = useState<string[]>([]);
    const [fontColors, setFontColors] = useState<string[]>([]);
    const [bgColors, setBgColors] = useState<string[]>([]);
    const [fontSizes, setFontSizes] = useState<number[]>([]);
    const [sizeErr, setSizeErr] = useState<string>('');
    const [isUppercase, setIsUppercase] = useState<boolean[]>([]);
    const standardSizes = [10, 12, 14, 16, 18, 20, 22, 24];
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        fetch("https://testapi.animalmore.ru/chat-admin/chat-admin/api/v1/tags/public", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка HTTP: ' + response.status);
                return response.json();
            })
            .then(data => {
                setTags(data);
                setTexts(data.map((tag: {text: string}) => tag.text));
                setFontColors(data.map((tag: { fontColor: string; }) => tag.fontColor));
                setBgColors(data.map((tag: { innerColor: string; }) => tag.innerColor));
                setFontSizes(data.map((tag: { size: number; }) => tag.size));
                setIsUppercase(data.map((tag: { isUpperCase: boolean; }) => tag.isUpperCase));
            })
            .catch(err => {
                setError(err.message);
            });
    }, []);

    interface Tag {
        "_id": string;
        "text": string;
        "innerColor": string;
        "fontColor": string;
        "size": number;
        "isUpperCase": boolean;
        "type": string;
        "status": string;
        "createdAt": Date;
        "updatedAt": Date;
    }

    const handleToggle = (index: number) => {
        // Если кликнули на уже активный элемент — закрываем
        if (activeTab === index) {
            setActiveTab(null);
        } else {
            // Иначе открываем новый
            setActiveTab(index);
        }
    };

    const toggleInstrument = (index: number) => {
        // Если кликнули на уже активный элемент — закрываем
        if (activeInstrument === index) {
            setActiveInstrument(null);
        } else {
            // Иначе открываем новый
            setActiveInstrument(index);
        }
    };

    const changeText = (e: ChangeEvent<HTMLInputElement>) => {
        if (activeTab === null) return;
        const newText = [...texts];
        newText[activeTab] = e.target.value;
        setTexts(newText);
    }

    const changeFontColor = (color: string) => {
        if (activeTab === null) return;
        const newColors = [...fontColors];
        newColors[activeTab] = color;
        setFontColors(newColors);
    }

    const changeBgColor = (color: string) => {
        if (activeTab === null) return;
        const newColors = [...bgColors];
        newColors[activeTab] = color;
        setBgColors(newColors);
    }

    const changeFontSizes = (e: ChangeEvent<HTMLInputElement>) => {
        if (activeTab === null) return;
        const newSizeVal = Number(e.target.value);
        if (newSizeVal < 10) {
            setSizeErr('Шрифт не может быть меньше 10');
        } else if (newSizeVal > 24) {
            setSizeErr('Шрифт не может быть больше 24');
        } else {
            const newSizes = [...fontSizes];
            newSizes[activeTab] = newSizeVal;
            setFontSizes(newSizes);
            setSizeErr('');
        }
    }

    const changeUppercase = (uppercase: boolean) => {
        if (activeTab === null) return;
        const newUppercase = [...isUppercase];
        newUppercase[activeTab] = uppercase;
        setIsUppercase(newUppercase);
        console.log(isUppercase);
    }

// Инициализируем массив refs
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, standardSizes.length);
    }, [standardSizes]);

    const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
        inputRefs.current[index] = el;
    };

    const handleSizeSelect = (size: number, index: number) => {
        if (activeTab === null) return;
        const newSize = [...fontSizes];
        newSize[activeTab] = size;
        setFontSizes(newSize);
        if (inputRefs.current[index]) {
            inputRefs.current[index].value = size.toString();
        }
        setShowDropdown(false);
    };

    const saveChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (activeTab === null) return;
        const button = e.currentTarget;
        button.innerText = 'Идёт сохранение...'
        fetch(`https://testapi.animalmore.ru/chat-admin/chat-admin/api/v1/tags/${tags[activeTab]._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                "text": texts[activeTab],
                "innerColor": bgColors[activeTab],
                "fontColor": fontColors[activeTab],
                "size": fontSizes[activeTab],
                "isUpperCase": isUppercase[activeTab],
            })
        }).then(r => r.json()).then(function () {
            button.innerText = 'Успешно сохранено!';
            console.log(texts, texts[activeTab]);
            setTimeout(() => button.innerText = 'Сохранить изменения', 3000)
        })
    }
    return (
        <div className="flex flex-col items-center min-h-screen">
            <Header />
            <main className="mt-24">
                <div className="bg-cwhite-1 flex flex-col items-center w-[1350px] min-h-[1000px]">
                    <div className="bg-cgreen-5 flex gap-8 w-full pt-3.5 pb-3.5">
                        <button className="p-3.5 border-cwhite-1 border-2 rounded-4xl flex gap-1 items-center text-cwhite-1 text-2xl cursor-pointer ml-10">
                            <Image src="/_.svg" alt="_" width={29} height={29} />
                            Выбрать тег
                        </button>
                        <button className="p-3.5 border-cwhite-1 border-2 rounded-4xl flex gap-1 items-center text-cwhite-1 text-2xl cursor-pointer">
                            <Image src="/+.svg" alt="_" width={29} height={29} />
                            Создать тег
                        </button>
                    </div>
                    {error &&
                    <div className="p-4 border-corange-1 border-2 rounded-sm">
                        <p className="text-red-600">{error}</p>
                    </div>
                    }
                    <div className="flex flex-col gap-14 mt-24">
                        {tags.map((tag, index) => (
                            <div key={tag._id} className="flex flex-col">
                                <div className="px-8 border-cgreen-1 rounded-4xl border-2 w-[1250px] h-24 flex items-center justify-between"
                                     onClick={() => handleToggle(index)}>
                                    <p className={`${isUppercase[index] ? "uppercase" : ""}`} style={{
                                        background: tag.innerColor,
                                        color: tag.fontColor,
                                        fontSize: tag.size}}>

                                        {tag.text}
                                    </p>
                                    <Image src="/arrow.svg" alt="arrow" width={34} height={34} className={`${activeTab === index ? "rotate-90" : ""} transition-all`} />
                                </div>
                                <div className={`${activeTab === index ? 'block' : 'hidden'} mt-5 border-corange-1 border-2`}>
                                    <input className={`bg-white h-20 w-full px-8 ${isUppercase[index] ? "uppercase" : ""}`}
                                           style={{
                                        color: fontColors[index],
                                        background: bgColors[index],
                                        fontSize: fontSizes[index],
                                        }}
                                           defaultValue={tag.text}
                                        onChange={changeText}/>
                                    <p className="text-corange-1 text-sm ml-10">Вы можете начать редактирование в этой области</p>
                                    <div className="flex items-start gap-20 pl-10 my-5 py-2.5 bg-white">
                                        <div className="flex flex-col gap-3">
                                            <Image src="/colorA.svg" alt="color" width={30} height={30} onClick={() => toggleInstrument(1)} />
                                            <div className={`${activeInstrument === 1 ? "block" : "hidden"}`}>
                                                <HexColorPicker color={fontColors[index]} onChange={changeFontColor}/>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Image src="/bgA.svg" alt="color" width={30} height={30} onClick={() => toggleInstrument(2)} />
                                            <div className={`${activeInstrument === 2 ? "block" : "hidden"}`}>
                                                <HexColorPicker color={bgColors[index]} onChange={changeBgColor}/>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center gap-1 border-corange-3 px-2 border-2"
                                             onClick={() => setShowDropdown(!showDropdown)}>
                                            <div className="flex gap-1">
                                                <input className="w-8 text-center
                                            [-moz-appearance:textfield]
                                            [&::-webkit-outer-spin-button]:appearance-none
                                            [&::-webkit-inner-spin-button]:appearance-none"
                                                       ref={setInputRef(index)}
                                                       defaultValue={fontSizes[index]}
                                                       type={"number"}
                                                       min="10"
                                                       max="24"
                                                       onChange={changeFontSizes}
                                                />
                                                пт
                                            </div>
                                            {sizeErr && <p className="text-red-500 text-sm">{sizeErr}</p>}

                                            {showDropdown && (
                                                <div
                                                    className="mt-1 max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg z-10"
                                                    onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике внутри
                                                >
                                                    {standardSizes.map((size) => (
                                                        <div
                                                            key={size}
                                                            onClick={() => handleSizeSelect(size, index)}
                                                            className={`px-3 py-2 hover:bg-corange-5 cursor-pointer ${
                                                                fontSizes[index] === size ? 'bg-corange-7 font-medium' : ''
                                                            }`}
                                                        >
                                                            {size}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>


                                        <Image src="/AA.svg" alt="color" width={30} height={30} onClick={() => changeUppercase(true)} />
                                        <Image src="/aa.svg" alt="color" width={30} height={30} onClick={() => changeUppercase(false)} />
                                    </div>
                                    <button className="ml-10 mb-2 py-3 px-8 bg-corange-1 text-cwhite-1 text-base hover:bg-corange-2 transition-all"
                                    onClick={saveChanges}>Сохранить изменения</button>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <footer className="w-8xl h-16 bg-cgreen-1 mt-24 flex">
                <Image src="/logo.svg"
                       alt="logo"
                       width={78}
                       height={41}
                       className="ml-7"/>
                <div className="flex gap-3.5 items-center justify-self-center m-auto">
                    <p className="text-xl text-cwhite-1 -ml-7">Существуем с 2024. По вопросам:</p>
                    <div className="relative flex justify-center">
                        <div className="group flex justify-center">
                            <Image src="/tg.svg"
                                   alt="telegram"
                                   width={65}
                                   height={30} />

                            <div className="absolute hidden group-hover:block bottom-full w-max px-5 py-1 text-sm text-cwhite-1 bg-cgreen-2 rounded-4xl whitespace-nowrap">
                                <p className="text-base">@FerubkoMSU</p>
                            </div>
                        </div>
                    </div>

                </div>

            </footer>
        </div>
    );
}