import { useState } from "react";

interface Props {
  value: string[];
  onChange: (newCourses: string[]) => void;
}

export default function FavouriteCourses({ value, onChange }: Props) {
  const [input, setInput] = useState("");

  const addCourse = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput("");
    }
  };

  const removeCourse = (course: string) => {
    onChange(value.filter((c) => c !== course));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Favourite Courses</label>
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCourse()}
          className="border p-2 rounded w-full"
          placeholder="Type and press Enter"
        />
        <button onClick={addCourse} className="bg-blue-500 text-white px-3 rounded">
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((course) => (
          <div key={course} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
            <span>{course}</span>
            <button
              onClick={() => removeCourse(course)}
              className="text-red-500 hover:text-red-700"
              title="Remove"
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
