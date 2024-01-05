import PropTypes from "prop-types";

function ResponseList({ responses, setInputView }) {
  return (
    <div>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <p className="text-xl text-center mb-5">
        {"Here's the list of generated suggestions:"}
      </p>
      <ul className="grid grid-cols-2 gap-10 pl-2 pr-2">
        {responses.map((response, index) => (
          <li key={index}>
            <button
              className="btn max-w-32 w-full sm:btn-lg"
              onClick={() => {
                setInputView(false);
              }}
            >
              {response}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

ResponseList.propTypes = {
  responses: PropTypes.array.isRequired,
  setInputView: PropTypes.func.isRequired,
};

export default ResponseList;
