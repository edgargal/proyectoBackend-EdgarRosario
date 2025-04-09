export default function cookieExtractor(req) {
  return req.cookies?.jwt || null;
}
