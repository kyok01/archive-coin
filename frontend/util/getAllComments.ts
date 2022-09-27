export async function getAllComments(contract) {
  const transaction = await contract.getAllComments();

  const comments = await Promise.all(
    transaction.map(async (c, i) => {
      const dateTime = new Date(c.timestamp * 1000);
      let item = {
        cId: i + 1,
        text: c.text,
        sender: c.sender,
        replyTo: c.replyTo.toNumber(),
        timestamp: dateTime.toLocaleDateString(),
      };
      return item;
    })
  );
  return comments;
}
