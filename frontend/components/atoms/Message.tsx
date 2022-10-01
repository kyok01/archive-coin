export const Message = ({ isMessageOfAccount, text, from }) => {
  return (
    <li
      className={`flex ${isMessageOfAccount ? "justify-end" : "justify-start"}`}
    >
      <div>
        {!isMessageOfAccount && <div>{from.substring(0, 6) + "..."}</div>}
        <div
          className={`relative max-w-xl px-4 py-2 text-gray-700 rounded shadow ${
            isMessageOfAccount && "bg-gray-100"
          }`}
        >
          <span className="block">{text}</span>
        </div>
      </div>
    </li>
  );
};
