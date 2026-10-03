import React, { useState, useEffect } from 'react';
import './SpeedTypingGame.css';
import TypingArea from './TypingArea';

const SpeedTypingGame = () => {
    const paragraphs = [
        "A plant is one of the most important living things that develop on the earth and is made up of stems, leaves, roots, and so on.Parts of Plants: The part of the plant that developed beneath the soil is referred to as root and the part that grows outside of the soil is known as shoot.The shoot consists of stems, branches, leaves, fruits, and flowers.Plants are made up of six main parts: roots, stems,leaves, flowers, fruits, and seeds. ",
        "The root is the part of the plant that grows in the soil. The primary root emerges from the embryo.Its primaryfunction is to provide the plant stability in the earth and make other mineral salts from the earth available to the plant for various metabolic processes There are three types of roots i.e.Tap Root, Adventitious Roots, and Lateral Root.The roots arise from the parts of the plant and not from the rhizomes roots.",
        "Stem is the posterior part that remains above the ground and grows negatively geotropic. Internodes and nodes are found on the stem.Branch, bud, leaf, petiole, flower, and inflorescence on a node are all those parts of the plant that remain above the ground and undergo negative subsoil development.The trees have brown bark and the young and newly developed stems are green.The roots arise from the parts of plant and not from the rhizomes roots.",
        "It is the blossom of a plant. A flower is the part of a plant that produces seeds, which eventually become other flowers.They are the reproductive system of a plant. Most flowers consist of 04 main parts that are sepals, petals, stamens, and carpels.The female portion of the flower is the carpels.The majority of flowers are hermaphrodites,meaning they have both male and female components.Others may consist of one of two parts and may be male or female.",
        "An aunt is a bassoon from the right perspective. As far as we can estimate, some posit the melic myanmar to be less than kutcha.One cannot separate foods from blowzy bows. The scampish closet reveals itself as a sclerous llama to those who look.A hip is the skirt of a peak.Some hempy laundries are thought of simply as orchids.A gum is a trumpet from the right perspective.A freebie flight is a wrench of the mind.Some posit the croupy."
    ];

    const [typingText, setTypingText] = useState('');
    const [inputFieldValue, setInputFieldValue] = useState('');
    const maxTime = 60;
    const [timeLeft, setTimeLeft] = useState(maxTime);
    const [charIndex, setCharIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [WPM, setWPM] = useState(0);
    const [CPM, setCPM] = useState(0);

    const loadParagraph = () => {
        const ranIndex = Math.floor(Math.random() * paragraphs.length);
        const inputField = document.getElementsByClassName('input-field')[0];
        if (inputField) {
            document.addEventListener("keydown", () => inputField.focus());
        }

        const content = Array.from(paragraphs[ranIndex]).map((letter, index) => (
            <span
                key={index}
                style={{
                    color: (letter !== ' ') ? 'black' : 'transparent'
                }}
                className={`char ${index === 0 ? 'active' : ''}`}
            >
                {(letter !== ' ') ? letter : '_'}
            </span>
        ));

        setTypingText(content);
        setInputFieldValue('');
        setCharIndex(0);
        setMistakes(0);
        setIsTyping(false);
        setTimeLeft(maxTime);
        setWPM(0);
        setCPM(0);
    };

    const handleKeyDown = (event) => {
        const characters = document.querySelectorAll('.char');

        if (
            event.key === 'Backspace' &&
            charIndex > 0 &&
            charIndex < characters.length &&
            timeLeft > 0
        ) {
            let newMistakes = mistakes;

            if (characters[charIndex - 1].classList.contains('correct')) {
                characters[charIndex - 1].classList.remove('correct');
            }
            if (characters[charIndex - 1].classList.contains('wrong')) {
                characters[charIndex - 1].classList.remove('wrong');
                newMistakes = Math.max(0, mistakes - 1);
                setMistakes(newMistakes);
            }

            characters[charIndex].classList.remove('active');
            characters[charIndex - 1].classList.add('active');

            const newIndex = charIndex - 1;
            setCharIndex(newIndex);

            const elapsed = maxTime - timeLeft;
            if (elapsed > 0) {
                const correctChars = newIndex - newMistakes;
                const wpm = Math.max(0, Math.round((correctChars / 5) * (60 / elapsed)));
                const cpm = Math.max(0, Math.round(correctChars * (60 / elapsed)));
                setWPM(wpm);
                setCPM(cpm);
            }
        }
    };

    const initTyping = (event) => {
        const characters = document.querySelectorAll('.char');
        const typedChar = event.target.value.slice(-1);

        if (charIndex < characters.length && timeLeft > 0 && typedChar) {
            let currentChar = characters[charIndex].innerText;
            if (currentChar === '_') currentChar = ' ';

            if (!isTyping) {
                setIsTyping(true);
            }

            let newMistakes = mistakes;

            if (typedChar === currentChar) {
                characters[charIndex].classList.remove('active');
                characters[charIndex].classList.add('correct');
                if (charIndex + 1 < characters.length) {
                    characters[charIndex + 1].classList.add('active');
                }
            } else {
                characters[charIndex].classList.remove('active');
                characters[charIndex].classList.add('wrong');
                if (charIndex + 1 < characters.length) {
                    characters[charIndex + 1].classList.add('active');
                }
                newMistakes = mistakes + 1;
                setMistakes(newMistakes);
            }

            const newIndex = charIndex + 1;
            setCharIndex(newIndex);

            if (newIndex === characters.length) {
                setIsTyping(false);
            }

            const elapsed = maxTime - timeLeft;
            if (elapsed > 0) {
                const correctChars = newIndex - newMistakes;
                const wpm = Math.max(0, Math.round((correctChars / 5) * (60 / elapsed)));
                const cpm = Math.max(0, Math.round(correctChars * (60 / elapsed)));
                setWPM(wpm);
                setCPM(cpm);
            }
        } else {
            setIsTyping(false);
        }

        setInputFieldValue('');
    };

    const resetGame = () => {
        setIsTyping(false);
        setTimeLeft(maxTime);
        setCharIndex(0);
        setMistakes(0);
        setTypingText('');
        setCPM(0);
        setWPM(0);

        const characters = document.querySelectorAll('.char');
        characters.forEach(span => {
            span.classList.remove("correct");
            span.classList.remove("wrong");
            span.classList.remove("active");
        });
        if (characters[0]) characters[0].classList.add('active');

        loadParagraph();
    };

    useEffect(() => {
        loadParagraph();
    }, []);

    useEffect(() => {
        let interval;

        if (isTyping && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    const next = prev - 1;
                    const elapsed = maxTime - next;
                    if (elapsed > 0) {
                        const correctChars = charIndex - mistakes;
                        const cpm = Math.max(0, Math.round(correctChars * (60 / elapsed)));
                        const wpm = Math.max(0, Math.round((correctChars / 5) * (60 / elapsed)));
                        setCPM(cpm);
                        setWPM(wpm);
                    }

                    if (next <= 0) {
                        setIsTyping(false);
                        return 0;
                    }
                    return next;
                });
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsTyping(false);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isTyping, timeLeft]);

    return (
        <div className="container">
            <input
                type='text'
                className="input-field"
                value={inputFieldValue}
                onChange={initTyping}
                onKeyDown={handleKeyDown}
            />
            <TypingArea
                typingText={typingText}
                inputFieldValue={inputFieldValue}
                timeLeft={timeLeft}
                mistakes={mistakes}
                WPM={WPM}
                CPM={CPM}
                initTyping={initTyping}
                handleKeyDown={handleKeyDown}
                resetGame={resetGame}
            />
        </div>
    );
};

export default SpeedTypingGame;