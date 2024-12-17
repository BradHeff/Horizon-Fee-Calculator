import { yearLevels } from "./Constants";

function YearLevelSelector({ onSelect, index, isNew, value }) {
  return (
    <div className={`select-style-2 ${isNew ? "new-dropdown" : ""}`}>
      <div className="select-position">
        <select onChange={(e) => onSelect(e.target.value, index)} value={value}>
          <option value="">Select Year Level</option>
          {yearLevels.map((year) => (
            <option key={year} value={year}>
              {year.charAt(0).toUpperCase() + year.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default YearLevelSelector;
