import { filter } from "./filterArr";
import { getAllPosts } from "./getAllPosts";

export async function getRepPosts(pId, contract) {
        const { posts, repCountArr } = await getAllPosts(contract);
    
        const repPosts = await filter(posts, async (p, i) => {
          const bool = p.replyTo == pId;
          console.log(bool);
          return bool;
        });
        return {repPosts, repCountArr}
}