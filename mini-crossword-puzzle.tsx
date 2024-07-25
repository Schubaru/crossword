import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, ArrowDown } from 'lucide-react';

const CrosswordPuzzle = () => {
  const [grid, setGrid] = useState([
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [direction, setDirection] = useState('across');
  const inputRefs = useRef([]);

  const acrossClues = [
    '1. Capital of France',
    '3. Opposite of hot',
    '5. Largest planet in our solar system',
  ];

  const downClues = [
    '1. First month of the year',
    '2. Seventh day of the week',
    '4. Frozen water',
  ];

  const handleCellClick = (row, col) => {
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      setDirection(prev => prev === 'across' ? 'down' : 'across');
    } else {
      setSelectedCell({ row, col });
    }
  };

  const handleInputChange = (row, col, value) => {
    const newGrid = [...grid];
    newGrid[row][col] = value.toUpperCase();
    setGrid(newGrid);

    if (value) {
      const nextCell = getNextCell(row, col);
      if (nextCell) {
        setSelectedCell(nextCell);
        inputRefs.current[nextCell.row * 5 + nextCell.col].focus();
      }
    }
  };

  const handleKeyDown = (event, row, col) => {
    if (event.key === 'Backspace' && !grid[row][col]) {
      event.preventDefault();
      const prevCell = getPrevCell(row, col);
      if (prevCell) {
        setSelectedCell(prevCell);
        const prevInput = inputRefs.current[prevCell.row * 5 + prevCell.col];
        prevInput.focus();
        prevInput.setSelectionRange(1, 1);  // Move cursor to the end
        
        // Clear the previous cell
        const newGrid = [...grid];
        newGrid[prevCell.row][prevCell.col] = '';
        setGrid(newGrid);
      }
    }
  };

  const getNextCell = (row, col) => {
    if (direction === 'across') {
      return col < 4 ? { row, col: col + 1 } : null;
    } else {
      return row < 4 ? { row: row + 1, col } : null;
    }
  };

  const getPrevCell = (row, col) => {
    if (direction === 'across') {
      return col > 0 ? { row, col: col - 1 } : null;
    } else {
      return row > 0 ? { row: row - 1, col } : null;
    }
  };

  const getCellHighlight = (row, col) => {
    if (!selectedCell) return '';
    if (selectedCell.row === row && selectedCell.col === col) return 'bg-yellow-200';
    if (direction === 'across' && selectedCell.row === row) return 'bg-blue-200';
    if (direction === 'down' && selectedCell.col === col) return 'bg-blue-200';
    return '';
  };

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-2xl font-bold text-center">Mini Crossword</CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="grid grid-cols-5 gap-1 mr-4">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <Input
                    key={`${rowIndex}-${colIndex}`}
                    ref={el => inputRefs.current[rowIndex * 5 + colIndex] = el}
                    className={`w-10 h-10 text-center font-bold ${getCellHighlight(rowIndex, colIndex)}`}
                    value={cell}
                    maxLength={1}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                  />
                ))
              )}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm mb-1">Direction</span>
              {direction === 'across' ? (
                <ArrowRight className="text-blue-500" size={24} />
              ) : (
                <ArrowDown className="text-blue-500" size={24} />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold mb-2">Across</h3>
              <ul className="list-disc list-inside">
                {acrossClues.map((clue, index) => (
                  <li key={`across-${index}`}>{clue}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Down</h3>
              <ul className="list-disc list-inside">
                {downClues.map((clue, index) => (
                  <li key={`down-${index}`}>{clue}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrosswordPuzzle;
