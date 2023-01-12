import Select from "react-select";

const styles = {
  menuList: (base) => ({
    ...base,
    "::-webkit-scrollbar": {
      width: "10px",
      height: "0px",
    },
    "::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#888",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
  }),
};

export default function MultiSelect({ options, onChange, field }) {
  return (
    <Select
      className="long-select"
      styles={styles}
      closeMenuOnSelect={false}
      options={options}
      isMulti
      menuPosition="fixed"
      onChange={(val) =>
        onChange({
          [field]: val.map((el) => el.value),
        })
      }
    />
  );
}
