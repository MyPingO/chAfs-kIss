import messages from "../../assets/messages.json";

export default function Success() {
  const randomMessage = messages.success[Math.floor(Math.random() * 10)];
  return (
    <div className="flex h-2/3 justify-center items-center text-center text-md md:text-xl">
      {randomMessage}
      <br />
      Please refresh the page if your plate count hasn&apos;t updated!
    </div>
  );
}
