import { type NextPage } from "next";
import { NewTweetForm } from "./components/NewTweetForm";

const Home: NextPage = () => {
  return (
    <div>
      <h1 className="px-4  py-2 text-xl">Home</h1>
      <NewTweetForm />
      <RecentTweets />
    </div>
  );
};

export default Home;


const RecentTweets = () => {

  return <InfiniteTweetList />
}
