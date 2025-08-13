'use client'
import React, {useState, useCallback, useRef, useEffect} from "react";
import type {MediaResourceOutput} from "@/utils/mediaProcessor";

interface MediaItem {
    id: string;
    url: string;
    type: string;
}
interface Message {
    id: string;
    text: string;
    reactions: MediaItem[];
}
interface Reaction {
    "_id": string;
    "reactionPack": string;
    "s3Id": string;
    "createdAt": string;
    "updatedAt": string;
}
interface ReactionPack {
    "_id": string;
    "name": string;
    "type": string;
    "status": string;
    "whiteRoleList": Array<any | null>[];
    "blackRoleList": Array<any | null>[];
    "praiseList": Array<any | null>[];
    "ageRestrictions": string;
    "reactionList": Reaction[];
    "cloudUrl": string;
    "cover": string;
    "fileExtension": string;
    "createdAt": string;
    "updatedAt": string;
}
export default function Reactions(mediaItems: MediaItem[]) {
    const [initialMessages, setInitialMessages] = useState<Message[]>([
        {id: '1', text: 'Привет! Как дела?', reactions: []},
        {id: '2', text: 'Посмотри на это', reactions: []},
    ]);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [reactionPacks, setReactionPacks] = useState<ReactionPack[]>([]);
    const [availableReactions, setAvailableReactions] = useState<MediaResourceOutput[]>([]);

    const toggleReaction = useCallback((messageId: string, reaction: MediaItem) => {
        setMessages(prev =>
            prev.map(msg => {
                if (msg.id !== messageId) return msg;

                const hasReaction = msg.reactions.some(r => r.id === reaction.id);
                return {
                    ...msg,
                    reactions: hasReaction
                        ? msg.reactions.filter(r => r.id !== reaction.id)
                        : [...msg.reactions, reaction]
                };
            })
        );
    }, []);

// Компонент отображения реакции
    const ReactionBadge = ({ reaction, onClick}: {
        reaction: MediaItem;
        onClick: () => void;
    }) => {
        const sizeClass = 'w-8 h-8';
        const iconSize = 'w-8 h-8';

        return (
            <div
                className={`${sizeClass} rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 hover:scale-125 transition-all`}
                onClick={e => {
                    e.stopPropagation();
                    onClick();
                }}
            >
                {reaction.type === 'static' ? (
                    <img src={reaction.url} alt="" className={`${iconSize} object-contain`} />
                ) : (
                    <video src={reaction.url} className={`${iconSize} object-contain`} autoPlay loop muted />
                )}
            </div>
        );
    };

// Компонент кнопки раскрытия
    const ExpandButton = ({
                              isExpanded,
                              onClick
                          }: {
        isExpanded: boolean;
        onClick: () => void
    }) => (
        <button
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors ml-1"
            onClick={e => {
                e.stopPropagation();
                onClick();
            }}
        >
            {isExpanded ? '▲' : '▼'}
        </button>
    );

// Компонент сообщения
    const MessageItem = ({
                             message,
                             onToggleReaction
                         }: {
        message: Message;
        onToggleReaction: (reaction: MediaItem) => void
    }) => {
        const [showReactions, setShowReactions] = useState(false);
        const [showAll, setShowAll] = useState(false);
        const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
        const quickReaction = availableReactions[0];

        // Очистка таймера при размонтировании
        useEffect(() => {
            return () => {
                if (hoverTimerRef.current) {
                    clearTimeout(hoverTimerRef.current);
                }
            };
        }, []);

        const handleMouseEnter = () => {
            // Устанавливаем таймер на 800ms перед показом реакций
            hoverTimerRef.current = setTimeout(() => {
                setShowReactions(true);
            }, 500);
        };

        const handleMouseLeave = () => {
            // Очищаем таймер при уходе курсора
            if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
            }
            setShowReactions(false);
            setShowAll(false);
        };

        const toggleReactionsPanel = (e: React.MouseEvent) => {
            e.stopPropagation();
            setShowAll(prev => !prev);
        };

        return (
            <div
                className="relative bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="text-gray-800">{message.text}</div>

                {/* Текущие реакции сообщения */}
                {message.reactions.length > 0 && (
                    <div className="flex gap-2 mt-2">
                        {message.reactions.map(r => (
                            <ReactionBadge
                                key={r.id}
                                reaction={r}
                                onClick={() => onToggleReaction(r)}
                            />
                        ))}
                    </div>
                )}

                {/* Панель быстрой реакции (появляется после задержки) */}
                {showReactions && (
                    <div className="absolute z-40 bottom-0 left-0 transform translate-y-1/2 flex bg-white rounded-r-full rounded-l-sm shadow-md p-1">
                        {quickReaction && (
                            <ReactionBadge
                                reaction={quickReaction}
                                onClick={() => onToggleReaction(quickReaction)}
                            />
                        )}
                        <button
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors ml-1"
                            onClick={toggleReactionsPanel}
                        >
                            {showAll ? '▲' : '▼'}
                        </button>
                    </div>
                )}

                {/* Полный список реакций */}
                {showAll && (
                    <div
                        className="absolute bottom-full left-0 max-h-32 overflow-auto bg-white rounded-lg shadow-xl p-2 flex flex-col gap-2 border border-gray-200"
                        onMouseEnter={() => setShowReactions(true)} // Сохраняем видимость при наведении на панель
                    >
                        {reactionPacks.map((reactionPack, index) => (
                            <div key={index} className="flex flex-col gap-2 border-b border-corange-1 pb-2">
                                <p>
                                    {reactionPack.name}
                                </p>

                                <div className="flex gap-2 flex-wrap">
                                    {reactionPack.reactionList.length > 0 ? (
                                        reactionPack.reactionList.map((reaction, index) => (
                                            <div key={index}>
                                                {availableReactions.map((r, index) => (
                                                    <div key={index}>
                                                        {r.id === reaction._id ?  (
                                                            <ReactionBadge
                                                                key={r.id}
                                                                reaction={r}
                                                                onClick={() => {
                                                                    onToggleReaction(r);
                                                                    setShowAll(false);
                                                                }}
                                                            />
                                                        ) : ""}
                                                    </div>
                                                ))}
                                            </div>
                                        ))) : <p className="text-gray-800">Пустой пак</p>}
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        );
    };
}
