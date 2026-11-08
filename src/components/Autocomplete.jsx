import { useState } from "react";

// The previous react-autocomplete package uses APIs removed in React 19.
export default function Autocomplete({
  suggestions = [],
  value,
  onChange,
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const matches = suggestions.filter((item) =>
    `${item.label} ${item.id}`
      .toLowerCase()
      .includes(value.trim().toLowerCase()),
  );
  const select = (item) => {
    onSelect(item);
    setOpen(false);
    setActive(0);
  };

  return (
    <div className="autocomplete">
      <input
        id="driver-name"
        aria-labelledby="driver-name-label"
        role="combobox"
        aria-expanded={open}
        aria-controls="driver-suggestions"
        aria-autocomplete="list"
        aria-activedescendant={
          open && matches[active] ? `driver-option-${active}` : undefined
        }
        placeholder="Search driver…"
        autoComplete="off"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            setActive((index) =>
              Math.max(
                0,
                Math.min(
                  matches.length - 1,
                  index + (event.key === "ArrowDown" ? 1 : -1),
                ),
              ),
            );
          } else if (event.key === "Enter" && open && matches[active]) {
            event.preventDefault();
            select(matches[active]);
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {open && matches.length > 0 && (
        <div
          id="driver-suggestions"
          role="listbox"
          className="suggestions-menu"
        >
          {matches.map((item, index) => (
            <div
              key={item.id}
              id={`driver-option-${index}`}
              role="option"
              aria-selected={index === active}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => select(item)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
