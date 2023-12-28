import PropTypes from "prop-types";

function BadInputs({ inputs, setInputs }) {
  // use a set for auto double filter

  function handleAdd(e, inputs, setInputs) {
    e.preventDefault();
    const input = e.target[0];

    if (input.value !== "") {
      const temp = new Set(inputs);
      temp.add(input.value);
      setInputs(temp);
      input.value = "";
    }
  }

  return (
    <>
      <form onSubmit={e => handleAdd(e, inputs, setInputs)}>
        <div className="join mb-2">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs join-item"
          />
          <button className="btn btn-primary join-item">Filter Item</button>
        </div>
      </form>
      <FilteredList inputs={inputs} setInputs={setInputs} />
    </>
  );
}

function FilteredList({ inputs, setInputs }) {
  function handleRemove(filteredItem, inputs, setInputs) {
    const temp = new Set(inputs);
    temp.delete(filteredItem);
    setInputs(temp);
  }

  return (
    <ul className="">
      {[...inputs].map((filteredItem, index) => (
        <li key={index} className="mb-2">
          <div className="join">
            <EditButton
              filteredItem={filteredItem}
              inputs={inputs}
              setInputs={setInputs}
            />
            <input
              type="text"
              value={filteredItem}
              className="input input-bordered w-3/4 max-w-xs join-item"
              disabled
            />
            <button
              className="btn btn-error join-item"
              onClick={() => handleRemove(filteredItem, inputs, setInputs)}
            >
              <img src="/close.svg" alt="X" width="20px" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function EditButton({ filteredItem, inputs, setInputs }) {
  function handleEdit(e, filteredItem, inputs, setInputs) {
    const input = document.getElementById(`updated-${filteredItem}`);
    if (input.value === "") {
      e.preventDefault();
      return;
    }

    const temp = new Set(inputs);
    temp.delete(filteredItem);
    temp.add(input.value);
    setInputs(temp);
    input.value = "";
  }

  return (
    <>
      <button
        className="btn btn-info join-item"
        onClick={() => document.getElementById(filteredItem).showModal()}
      >
        <img src="/edit.svg" alt="edit" width="20px" />
      </button>

      <dialog id={filteredItem} className="modal">
        <div className="modal-box flex flex-col items-center">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">Enter updated value:</h3>
          <form method="dialog" className="flex justify-evenly w-full">
            <input
              type="text"
              placeholder={filteredItem}
              className="input input-bordered"
              id={`updated-${filteredItem}`}
            />
            <button
              className="btn btn-success"
              onClick={e => {
                handleEdit(e, filteredItem, inputs, setInputs);
              }}
            >
              Update
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default BadInputs;

BadInputs.propTypes = {
  inputs: PropTypes.object.isRequired,
  setInputs: PropTypes.func.isRequired,
};

FilteredList.propTypes = {
  inputs: PropTypes.object.isRequired,
  setInputs: PropTypes.func.isRequired,
};

EditButton.propTypes = {
  filteredItem: PropTypes.string.isRequired,
  inputs: PropTypes.object.isRequired,
  setInputs: PropTypes.func.isRequired,
};
