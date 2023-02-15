import { NextRequest, NextResponse } from 'next/server';
import { getCookie } from "cookies-next";

export default async function middleware(req, res) {
    const { pathname } = req.nextUrl;
    let akses = false;
    console.log(pathname);
    if(pathname.match(/api.*/) ||
       pathname == "/" ||
        pathname.match(/static.*/)||
        pathname.match(/login.*/) || 
        !getCookie('menu', {req, res})
        ){
      return NextResponse.next()
    } 
    else {
      const menus = JSON.parse(getCookie('menu', {req, res}));
      menus.map((x) => {
        if (pathname.replace("/","") == x.name){
          akses = true;
          return true
        }   
      })
    }
    if (!akses){
      return NextResponse.rewrite(new URL(`/not-found`, req.url));
    }
    return NextResponse.next()
  }