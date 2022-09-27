export async function getAllPosts(contract) {
    const transaction = await contract.getAllPosts();

    const posts = await Promise.all(transaction.map(async (p, i) => {
        const dateTime = new Date(p.timestamp * 1000);
        let item = {
            pId: i+1,
            title: p.title,
            text: p.text,
            sender: p.sender,
            replyTo: p.replyTo.toNumber(),
            timestamp: dateTime.toLocaleDateString()
        }
        return item;
    }));

    const repCountArr = [...Array(posts.length+1)].map(i => 0);

    await Promise.all(posts.map(async (p, i, posts) => {
        p.replyTo != 0 && repCountArr[p.replyTo]++;
        return p;
    }));

    return {posts, repCountArr}
}