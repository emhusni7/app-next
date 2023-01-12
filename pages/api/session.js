// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
  const user = req.session.get("user");
  res.json({data: user});
}