import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import {
  FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { api } from "~/utils/api";

const updateTextAreaHeight = (textArea?: HTMLTextAreaElement) => {
  if (!textArea) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
};

export const NewTweetForm = () => {
  const session = useSession();
  if (session.status !== "authenticated") return <div>loading...</div>;

  return <Form />;
};

const Form = () => {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");

  const textAreaRef = useRef<HTMLTextAreaElement>();

  const inputRef = useCallback((textAred: HTMLTextAreaElement) => {
    updateTextAreaHeight(textAred);
    textAreaRef.current = textAred;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaHeight(textAreaRef.current);
  }, [inputValue]);

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      console.log("tweet created", newTweet);
      setInputValue("");
    },
  });

  const handelSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.length === 0) return;
    createTweet.mutate({ content: inputValue });
  };

  if (session.status !== "authenticated") return null;

  return (
    <form
      onSubmit={handelSubmit}
      className="flex flex-col gap-2 border-b px-4 py-2"
    >
      <div className="flex gap-4">
        <ProfileImage src={session.data?.user.image} />
        <textarea
          style={{
            height: 0,
          }}
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          placeholder="What's happening?"
        ></textarea>
      </div>
      <Button className=" self-end">Tweet</Button>
    </form>
  );
};
