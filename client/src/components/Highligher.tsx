import React, { useState } from 'react'
interface HighlighterProps {
    content: string;
    query: string
}
const Highligher = ({content , query}:HighlighterProps) => {

    const highlightText = (text: string, highlight: string): JSX.Element[] => {
        if (!highlight) return [<span key={0}>{text}</span>];
        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <span key={index} className="bg-yellow-300">{part}</span>
            ) : (
                <span key={index}>{part}</span>
            )
        );
    };

  return (
    <>
        <div className='p-1'>
            {highlightText(content , query)}
        </div>
    </>
  )
}

export default Highligher