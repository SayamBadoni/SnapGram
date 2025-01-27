import { searchPosts } from "@/lib/appwrite/api";
import GridPostList from "./GridPostList";
import Loader from "./Loader";

type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: boolean;
}

const  SearchResults = ({isSearchFetching, searchedPosts}: SearchResultProps) => {
  if(isSearchFetching) return <Loader/>

  if(searchedPosts && searchedPosts.documents.length > 0) {
    return (
      <GridPostList posts={searchedPosts.documents}/>
    )
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  )
}

export default SearchResults