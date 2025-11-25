'use client';
import * as React from "react"
import "tailwindcss";
import { NavBar } from "@/components/NavBar"
import { Card } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react";
import { KanaCharacter, kanaData } from "@/lib/kanaData";

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function KanaStudyModule() {
  const [currentKanaList, setCurrentKanaList] = useState(kanaData);
  const [currentType, setCurrentType] = useState<'hiragana' | 'katakana'>('hiragana');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentCharacter = currentKanaList[currentIndex];

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % currentKanaList.length);
  };

  const handlePrev = () => {
    setShowAnswer(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + currentKanaList.length) % currentKanaList.length);
  };

  const handleRandomize = () => {
    setCurrentKanaList(shuffleArray(currentKanaList));
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const handleStartQuiz = () => {
    alert("Quiz Mode started! (Feature under construction)");
  };

  return (
    <div className="flex flex-col items-center justify-center pt-20 max-w-5xl mx-auto text-center space-y-6">
      <h1 className="text-4xl font-bold text-white mb-6">Kana Study Module</h1>

      <Tabs 
        defaultValue="hiragana" 
        className="w-[400px] text-white" 
        onValueChange={(value) => {
          setCurrentType(value as 'hiragana' | 'katakana');
          setShowAnswer(false);
        }}
      >
        <TabsList className="bg-[#424769] w-full">
          <TabsTrigger value="hiragana" className="text-white data-[state=active]:bg-[#2d3250] data-[state=active]:text-[#E1AA4C]">Hiragana</TabsTrigger>
          <TabsTrigger value="katakana" className="text-white data-[state=active]:bg-[#2d3250] data-[state=active]:text-[#E1AA4C]">Katakana</TabsTrigger>
        </TabsList>
        <TabsContent value="hiragana" className="w-full">
          <KanaCard 
            character={currentCharacter} 
            type="hiragana" 
            showAnswer={showAnswer} 
            setShowAnswer={setShowAnswer}
          />
        </TabsContent>
        <TabsContent value="katakana" className="w-full">
          <KanaCard 
            character={currentCharacter} 
            type="katakana" 
            showAnswer={showAnswer} 
            setShowAnswer={setShowAnswer}
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex space-x-4">
        <Button onClick={handlePrev} variant="outline" className="text-white bg-[#424769] border-white">
          Previous
        </Button>
        <Button onClick={handleNext} className="text-white bg-[#E1AA4C] hover:bg-white">
          Next Character
        </Button>
        <Button onClick={handleRandomize} variant="secondary" className="text-white bg-[#5c4269] hover:bg-[#725482]">
          Randomize
        </Button>
        <Button onClick={handleStartQuiz} className="text-white bg-[#10b981] hover:bg-[#059669]">
          Start Quiz
        </Button>
      </div>
      <p className="text-white mt-4">
        Character {currentIndex + 1} of {currentKanaList.length}
      </p>
    </div>
  );
}

interface KanaCardProps {
  character: KanaCharacter;
  type: 'hiragana' | 'katakana';
  showAnswer: boolean;
  setShowAnswer: (show: boolean) => void;
}

function KanaCard({ character, type, showAnswer, setShowAnswer }: KanaCardProps) {
  const displayChar = type === 'hiragana' ? character.hiragana : character.katakana;

  return (
    <Card className="bg-[#424769] border-none text-white shadow-2xl p-8 h-64 flex flex-col justify-between items-center">
      <p className="text-8xl font-sans mb-4">{displayChar}</p>
      
      {showAnswer ? (
        <div className="text-3xl font-semibold text-[#E1AA4C] h-12 flex items-center justify-center">
          {character.romaji}
        </div>
      ) : (
        <div className="h-12 flex items-center justify-center">
          <Button 
            onClick={() => setShowAnswer(true)} 
            variant="secondary" 
            className="bg-[#2d3250] hover:bg-[#3d4254] text-white"
          >
            Show Reading
          </Button>
        </div>
      )}
    </Card>
  );
}
export default function KanaPage() {
  return (
    <div className="min-h-screen font-sans bg-[#2d3250] dark:bg-black">
      <header className="sticky top-0 z-50 w-full">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <NavBar />
        </div>
      </header>
      <KanaStudyModule />
    </div>
  );
}