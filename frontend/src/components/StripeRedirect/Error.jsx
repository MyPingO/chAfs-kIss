import messages from "../../assets/messages.json";

export default function Error() {
  const randomMessage = messages.error[Math.floor(Math.random() * 10)];
  return (
    <div className="flex h-2/3 justify-center items-center text-center text-md md:text-xl">
      {randomMessage}
    </div>
  );
}
