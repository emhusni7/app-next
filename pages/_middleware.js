import { NextRequest, NextResponse } from 'next/server';
import { getCookie } from "cookies-next";

export default async function middleware(req, res) {
    const { pathname } = req.nextUrl;
    // let akses = false;
    // console.log(pathname);
    // if(pathname.match(/api.*/) ||
    //    pathname == "/" ||
    //     pathname.match(/static.*/)||
    //     pathname.match(/login.*/)
    //     ){
    //   return NextResponse.next()
    // } 
    // else {
    //   const menus = JSON.parse(getCookie('menu', {req, res}));
    //   menus.map((x) => {
    //     if (pathname.replace("/","") == x.name){
    //       akses = true;
    //       return true
    //     }   
    //   })
    // }
    // if (!akses){
    //   return new NextResponse(
    //   JSON.stringify({ success: false, message: 'authentication failed' }),
    //   { status: 401, headers: { 'content-type': 'application/json' }})
    // }
    return NextResponse.next()
  }