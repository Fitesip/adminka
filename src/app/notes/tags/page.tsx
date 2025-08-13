'use client'
import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import Image from "next/image";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HexColorPicker } from "react-colorful";

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

interface ExampleTag {
    "text": string;
    "innerColor": string;
    "fontColor": string;
    "size": number;
    "isUpperCase": boolean;
}

const exampleTag: ExampleTag = {
    "text": "example",
    "innerColor": "#ffffff",
    "fontColor": "#000000",
    "size": 18,
    "isUpperCase": false,
}

export default function Home() {
    const [changeTag, setChangeTag] = useState<number | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [saveNewTagStatus, setSaveNewTagStatus] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<number | null>(null);
    const [activeCreateTab, setActiveCreateTab] = useState<number | null>(null);
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
    const [newTag, setNewTag] = useState<ExampleTag>(exampleTag);
    const inputRefNewTag = useRef<(HTMLInputElement | null)>(null);

    const refreshTags = async () => {
        fetch("https://testapi.animalmore.ru/chat-admin/chat-admin/api/v1/tags/public", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
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
    }
    useEffect(() => {
        refreshTags
    }, []);

    const toggleChangeTag = () => {
        if (changeTag) {
            setChangeTag(null);
            setActiveTab(null);
            setActiveInstrument(null);
        } else {
            setChangeTag(1);
        }
    };

    const handleToggle = (index: number) => {
        if (!changeTag) {return}
        setActiveCreateTab(null)
        setShowDropdown(false)
        toggleInstrument(0)
        if (activeTab === index) {
            setActiveTab(null);
        } else {
            setActiveTab(index);
        }
    };

    const handleToggleCreateTab = () => {
        setActiveTab(null)
        toggleInstrument(0)
        setShowDropdown(false)
        if (activeCreateTab) {
            setActiveCreateTab(null);
        } else {
            setActiveCreateTab(1);
        }
    };

    const toggleInstrument = (index: number) => {
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
    }

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

    const changeTextNewTag = (e: ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        changeNewTag("text", newText);
    }
    const changeFontSizesNewTag = (e: ChangeEvent<HTMLInputElement>) => {
        const newSizeVal = Number(e.target.value);
        if (newSizeVal < 10) {
            setSizeErr('Шрифт не может быть меньше 10');
        } else if (newSizeVal > 24) {
            setSizeErr('Шрифт не может быть больше 24');
        } else {
            changeNewTag("size", newSizeVal);
            setSizeErr('');
        }
    }
    const changeFontColorNewTag = (color: string) => {
        changeNewTag("fontColor", color);
    }
    const changeBgColorNewTag = (color: string) => {
        changeNewTag("innerColor", color);
    }
    const handleSizeSelectNewTag = (size: number) => {
        changeNewTag("size", size);
        if (inputRefNewTag.current) {
            inputRefNewTag.current.value = size.toString();
        }
        setShowDropdown(false);
    };
    const changeUppercaseNewTag = (uppercase: boolean) => {
        changeNewTag("uppercase", uppercase);
    }
    const changeNewTag = (attr: string, value: any) => {
        if (attr === 'text') {
            setNewTag(prevTag => ({
                ...prevTag,
                text: value
            }));
        }
        else if (attr === 'innerColor') {
            setNewTag(prevTag => ({
                ...prevTag,
                innerColor: value
            }));
        }
        else if (attr === 'fontColor') {
            setNewTag(prevTag => ({
                ...prevTag,
                fontColor: value
            }));
        }
        else if (attr === 'size') {
            setNewTag(prevTag => ({
                ...prevTag,
                size: value
            }));
        }
        else if (attr === 'uppercase') {
            setNewTag(prevTag => ({
                ...prevTag,
                isUpperCase: value
            }));
        }

    }
    const saveChanges = async () => {
        if (activeTab === null) return;
        setSaveStatus('pending');
        console.log(tags[activeTab]);
        try {
            const req = await fetch(`https://testapi.animalmore.ru/chat-admin/chat-admin/api/v1/tags/${tags[activeTab]._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    "text": texts[activeTab],
                    "innerColor": bgColors[activeTab],
                    "fontColor": fontColors[activeTab],
                    "size": fontSizes[activeTab],
                    "isUpperCase": isUppercase[activeTab],
                })
            })

            const res = await req.json()
            if (req.status === 200) {
                setSaveStatus('success');
                refreshTags()
            } else {
                setSaveStatus('error');
            }
            setTimeout(() => setSaveStatus(null), 3000)
            }
        catch (error) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000)
        }

    }

    const createTag = async () => {
        setSaveNewTagStatus('pending');
        try {
            const req = await fetch(`https://testapi.animalmore.ru/chat-admin/chat-admin/api/v1/tags/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                },
                body: JSON.stringify(newTag)
            })
            const res = await req.json()

            if (req.status === 200) {
                setSaveNewTagStatus('success');
                refreshTags()
            } else {
                setSaveNewTagStatus('error');
            }
            setTimeout(() => setSaveNewTagStatus(null), 3000)
        }
        catch (error) {
            setSaveNewTagStatus('error');
            setTimeout(() => setSaveNewTagStatus(null), 3000)
        }
    }
    return (
        <div className="flex flex-col items-center min-h-screen">
            <Header />
            <main className="mt-24 grow-1">
                <div className="bg-cwhite-1 flex flex-col items-center w-[1350px] min-h-[1000px]">
                    <div className="bg-cgreen-1 flex gap-8 w-full pt-3.5 pb-3.5 rounded-t-xl">
                        <button className="p-3.5 border-cwhite-1 border-2 rounded-4xl flex gap-1 items-center text-cwhite-1 text-2xl cursor-pointer ml-10 hover:bg-cgreen-2 transition-all"
                        onClick={toggleChangeTag}>
                            <Image src="/_.svg" alt="_" width={29} height={29} />
                            Выбрать тег
                        </button>
                        <button className="p-3.5 border-cwhite-1 border-2 rounded-4xl flex gap-1 items-center text-cwhite-1 text-2xl cursor-pointer hover:bg-cgreen-2 transition-all"
                        onClick={handleToggleCreateTab}>
                            <Image src="/+.svg" alt="_" width={29} height={29} />
                            Создать тег
                        </button>
                    </div>



                    <div className={`${activeCreateTab ? 'border max-h-68' : 'max-h-0 border-0'} mt-5 border-corange-1 transition-1 rounded-xl overflow-hidden`}>
                        <input className={`bg-white h-20 w-full px-8 ${newTag.isUpperCase ? "uppercase" : ""}`}
                               style={{
                                   color: newTag.fontColor,
                                   background: newTag.innerColor,
                                   fontSize: newTag.size,
                               }}
                               defaultValue={newTag.text}
                               onChange={changeTextNewTag}/>
                        <p className="text-corange-1 text-sm ml-10">Вы можете начать редактирование в этой области</p>
                        <div className="flex items-start gap-20 px-10 my-5 py-2.5 bg-white">
                            <div className="flex items-start gap-3">
                                <Image src="/colorA.svg" alt="color" width={46} height={46} onClick={() => toggleInstrument(1)}
                                       className="hover:shadow-2xl p-2 shadow-black transition-1"/>
                                <div className={`${activeInstrument === 1 && activeTab === null ? "h-[230px]" : "h-0"} overflow-hidden flex w-[230px] items-center justify-center transition-1 absolute -ml-5 mt-10`}>
                                    <HexColorPicker color={newTag.fontColor} onChange={changeFontColorNewTag}/>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Image src="/bgA.svg" alt="color" width={46} height={46} onClick={() => toggleInstrument(2)}
                                       className="hover:shadow-2xl p-2 shadow-black transition-1"/>
                                <div className={`${activeInstrument === 2 && activeTab === null ? "h-[230px]" : "h-0"} overflow-hidden flex w-[230px] items-center justify-center transition-1 absolute -ml-5 mt-10`}>
                                    <HexColorPicker color={newTag.fontColor} onChange={changeBgColorNewTag}/>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center gap-1 border-corange-3 px-2 border-2 hover:shadow-2xl p-2 shadow-black transition-1"
                                 onClick={() => setShowDropdown(!showDropdown)}>
                                <div className="flex gap-1">
                                    <input className="w-8 text-center
                                            [-moz-appearance:textfield]
                                            [&::-webkit-outer-spin-button]:appearance-none
                                            [&::-webkit-inner-spin-button]:appearance-none"
                                           ref={inputRefNewTag}
                                           defaultValue={"18"}
                                           type={"number"}
                                           min="10"
                                           max="24"
                                           onChange={changeFontSizesNewTag}
                                    />
                                    пт
                                </div>
                                {sizeErr && <p className="text-red-changeUppercase500 text-sm">{sizeErr}</p>}

                                <div
                                    className={`${showDropdown && changeTag !== null ? "max-h-64 border" : "max-h-0"} ml-18 absolute transition-1 overflow-y-auto bg-white rounded-md shadow-lg z-10`}
                                    onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике внутри
                                >
                                    {standardSizes.map((size) => (
                                        <div
                                            key={size}
                                            onClick={() => handleSizeSelectNewTag(size)}
                                            className={`px-3 py-2 hover:bg-corange-5 cursor-pointer ${
                                                newTag.size === size ? 'bg-corange-7 font-medium' : ''
                                            }`}
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Image src="/AA.svg" alt="color" width={46} height={46} onClick={() => changeUppercaseNewTag(true)}
                                   className="hover:shadow-2xl p-2 shadow-black transition-1"/>
                            <Image src="/aa.svg" alt="color" width={46} height={46} onClick={() => changeUppercaseNewTag(false)}
                                   className="hover:shadow-2xl p-2 shadow-black transition-1"/>
                        </div>
                        <div className={`
                                    ${saveNewTagStatus === null ? "px-8 bg-corange-1 text-cwhite-1 hover:bg-corange-2 border-corange-2" : ""}
                                    ${saveNewTagStatus === 'error' ? "px-0 gap-4 pr-4 bg-cred-1 text-cred-2 hover:bg-cred-2 border-cred-2 hover:text-cred-1" : ""}
                                    ${saveNewTagStatus === 'success' ? "px-0 gap-4 pr-4 bg-cwhite-1 text-cgreen-1 hover:bg-cgreen-1 border-cgreen-1 hover:text-cwhite-1" : ""}
                                    ${saveNewTagStatus === 'pending' ? "px-4 bg-corange-1 text-cwhite-1 gap-4" : ""}
                                        ml-10 mb-2 h-12 flex items-center overflow-hidden text-base rounded-sm w-max transition-all border`}
                             onClick={() => createTag()}>
                            {saveNewTagStatus === null && "Сохранить изменения"}
                            {saveNewTagStatus === 'pending' && <Image src="/loading.svg" alt="loading" width={40} height={40}
                                                                className="loading" />}
                            {saveNewTagStatus === 'pending' && "Идёт сохранение..."}
                            {saveNewTagStatus === 'success' && <Image src="/V.svg" alt="V" width={48} height={48} />}
                            {saveNewTagStatus === 'success' && "Успешно сохранено!"}
                            {saveNewTagStatus === 'error' && <Image src="/X.svg" alt="X" width={48} height={48} />}
                            {saveNewTagStatus === 'error' && "Ошибка сохранения"}
                        </div>
                    </div>



                    {error &&
                    <div className="p-4 border-corange-1 border-2 rounded-sm">
                        <p className="text-red-600">{error}</p>
                    </div>
                    }
                    <div className={`flex gap-14 mt-24 ${!changeTag ? "flex-row justify-around flex-wrap" : "flex-col"}`}>
                        {tags.map((tag, index) => (
                            <div key={tag._id} className={`flex flex-col`}>
                                <div className={`px-8 border-cgreen-1 rounded-4xl border-2 h-24 flex items-center justify-between transition-all ${changeTag ? "w-[1250px]" : "w-xl"}`}
                                     onClick={() => handleToggle(index)}>
                                    <p className={`py-1 px-3 ${isUppercase[index] ? "uppercase" : ""}`} style={{
                                        background: tag.innerColor,
                                        color: tag.fontColor,
                                        fontSize: tag.size}}>

                                        {tag.text}
                                    </p>
                                    <Image src="/arrow.svg" alt="arrow" width={34} height={34} className={`${activeTab === index ? "rotate-90" : ""} ${!changeTag ? "hidden opacity-0" : "opacity-100"} transition-all`} />

                                </div>
                                <div className={`${activeTab === index ? 'border max-h-68' : 'max-h-0'} mt-5 border-corange-1 overflow-hidden transition-1`}>
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
                                            <Image src="/colorA.svg" alt="color" width={46} height={46} onClick={() => toggleInstrument(1)}
                                                    className="hover:shadow-2xl p-2 shadow-black transition-1"/>
                                            <div className={`${activeInstrument === 1 && activeTab === index ? "h-[230px]" : "h-0"} overflow-hidden flex w-[230px] items-center justify-center transition-1 absolute -ml-5 mt-10`}>
                                                <HexColorPicker color={newTag.fontColor} onChange={changeFontColor}/>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Image src="/bgA.svg" alt="color" width={46} height={46} onClick={() => toggleInstrument(2)}
                                                    className="hover:shadow-2xl p-2 shadow-black transition-1"/>
                                            <div className={`${activeInstrument === 2 && activeTab === index ? "h-[230px]" : "h-0"} overflow-hidden flex w-[230px] items-center justify-center transition-1 absolute -ml-5 mt-10`}>
                                                <HexColorPicker color={newTag.fontColor} onChange={changeBgColor}/>
                                            </div>
                                        </div>
                                        <div className={`flex flex-col justify-center gap-1 border-corange-3 px-2 border-2 hover:shadow-2xl p-2 shadow-black transition-1`}
                                             onClick={() => setShowDropdown(!showDropdown)}>
                                            <div className="flex gap-1">
                                                <input className={`w-10 text-center
                                            [-moz-appearance:textfield]
                                            [&::-webkit-outer-spin-button]:appearance-none
                                            [&::-webkit-inner-spin-button]:appearance-none`}
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

                                            <div
                                                className={`${showDropdown && activeTab === index ? "max-h-64 border" : "max-h-0"} ml-18 absolute transition-1 overflow-y-auto bg-white rounded-md shadow-lg z-10`}
                                                onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике внутри
                                            >
                                                {standardSizes.map((size) => (
                                                    <div
                                                        key={size}
                                                        onClick={() => handleSizeSelect(size, index)}
                                                        className={`px-3 py-2 hover:bg-corange-5 cursor-pointer ${
                                                            newTag.size === size ? 'bg-corange-7 font-medium' : ''
                                                        }`}
                                                    >
                                                        {size}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>


                                        <Image src="/AA.svg" alt="color" width={46} height={46} onClick={() => changeUppercase(true)}
                                               className="hover:shadow-2xl p-2 shadow-black transition-1"/>
                                        <Image src="/aa.svg" alt="color" width={46} height={46} onClick={() => changeUppercase(false)}
                                               className="hover:shadow-2xl p-2 shadow-black transition-1"/>
                                    </div>
                                    <div className={`
                                    ${saveStatus === null ? "px-8 bg-corange-1 text-cwhite-1 hover:bg-corange-2 border-corange-2" : ""}
                                    ${saveStatus === 'error' ? "px-0 gap-4 pr-4 bg-cred-1 text-cred-2 hover:bg-cred-2 border-cred-2 hover:text-cred-1" : ""}
                                    ${saveStatus === 'success' ? "px-0 gap-4 pr-4 bg-cwhite-1 text-cgreen-1 hover:bg-cgreen-1 border-cgreen-1 hover:text-cwhite-1" : ""}
                                    ${saveStatus === 'pending' ? "px-4 bg-corange-1 text-cwhite-1 gap-4" : ""}
                                        ml-10 mb-2 h-12 flex items-center overflow-hidden text-base rounded-sm w-max transition-all border`}
                                    onClick={() => saveChanges()}>
                                        {saveStatus === null && "Сохранить изменения"}
                                        {saveStatus === 'pending' && <Image src="/loading.svg" alt="loading" width={40} height={40}
                                        className="loading" />}
                                        {saveStatus === 'pending' && "Идёт сохранение..."}
                                        {saveStatus === 'success' && <Image src="/V.svg" alt="V" width={48} height={48} />}
                                        {saveStatus === 'success' && "Успешно сохранено!"}
                                        {saveStatus === 'error' && <Image src="/X.svg" alt="X" width={48} height={48} />}
                                        {saveStatus === 'error' && "Ошибка сохранения"}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}