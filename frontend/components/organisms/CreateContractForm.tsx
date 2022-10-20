import { PrimaryBtn } from "components/atoms/PrimaryBtn";
import { InputWithLabels } from "components/molecules/InputWithLabels";

export const CreateContractForm = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col justify-center items-center">
        <InputWithLabels
          text="mint price(ether)"
          type="text"
          name="mintPrice"
          placeholder="price"
          AltLabel1="*"
          required={true}
        />
        <InputWithLabels
          text="max supply"
          type="number"
          name="maxSupply"
          placeholder="amount"
          AltLabel1="*"
          required={true}
        />
        <InputWithLabels
          text="Token URI"
          type="text"
          name="tokenUri"
          placeholder="ex. ipfs://xxx"
          AltLabel1="*"
          required={true}
        />
      </div>
      <div className="flex justify-center my-2">
        <PrimaryBtn type="submit">Create Contract</PrimaryBtn>
      </div>
    </form>
  );
};
