import PropTypes from "prop-types";

function ResponseList({ responses }) {
  return (
    <div>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <p className="text-xl text-black dark:text-white text-center mb-5">
        Here's the list of generated suggestions:
      </p>
      <ul className="grid grid-cols-2 gap-10 pl-2 pr-2">
        {responses.map((response, index) => (
          <li key={index}>
            <button className="btn max-w-32 w-full sm:btn-lg">
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
};

export default ResponseList;
