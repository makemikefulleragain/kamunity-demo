(()=>{var e={};e.id=4721,e.ids=[4721],e.modules={20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{"use strict";e.exports=require("buffer")},84770:e=>{"use strict";e.exports=require("crypto")},17702:e=>{"use strict";e.exports=require("events")},32615:e=>{"use strict";e.exports=require("http")},35240:e=>{"use strict";e.exports=require("https")},98216:e=>{"use strict";e.exports=require("net")},68621:e=>{"use strict";e.exports=require("punycode")},76162:e=>{"use strict";e.exports=require("stream")},82452:e=>{"use strict";e.exports=require("tls")},17360:e=>{"use strict";e.exports=require("url")},71568:e=>{"use strict";e.exports=require("zlib")},58359:()=>{},93739:()=>{},97095:(e,s,r)=>{"use strict";r.r(s),r.d(s,{originalPathname:()=>O,patchFetch:()=>R,requestAsyncStorage:()=>c,routeModule:()=>n,serverHooks:()=>m,staticGenerationAsyncStorage:()=>d});var o={};r.r(o),r.d(o,{POST:()=>p});var t=r(49303),i=r(88716),a=r(60670),u=r(87070);let l=(0,r(72438).eI)("https://txwjfzlnmydonxvdtmqp.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:!1,persistSession:!1}});async function p(e){try{console.log("\uD83D\uDD27 Fixing RLS policies for demo deployment...");let e=`
      -- Drop existing restrictive policies
      DROP POLICY IF EXISTS "Users can only view own profile" ON users;
      DROP POLICY IF EXISTS "Users can only update own profile" ON users;
      DROP POLICY IF EXISTS "Only authenticated users can insert" ON users;
      
      -- Create permissive policies for demo
      CREATE POLICY "Allow demo user creation" ON users
        FOR INSERT WITH CHECK (true);
        
      CREATE POLICY "Allow demo user updates" ON users
        FOR UPDATE USING (true);
        
      CREATE POLICY "Allow demo user reads" ON users
        FOR SELECT USING (true);
    `,{error:s}=await l.rpc("exec_sql",{sql:e});s?console.error("Users RLS policy error:",s):console.log("✅ Users RLS policies updated");let r=`
      -- Drop existing restrictive policies
      DROP POLICY IF EXISTS "Rooms are viewable by everyone" ON rooms;
      DROP POLICY IF EXISTS "Only authenticated users can create rooms" ON rooms;
      
      -- Create permissive policies for demo
      CREATE POLICY "Allow demo room creation" ON rooms
        FOR INSERT WITH CHECK (true);
        
      CREATE POLICY "Allow demo room reads" ON rooms
        FOR SELECT USING (true);
        
      CREATE POLICY "Allow demo room updates" ON rooms
        FOR UPDATE USING (true);
    `,{error:o}=await l.rpc("exec_sql",{sql:r});o?console.error("Rooms RLS policy error:",o):console.log("✅ Rooms RLS policies updated");let t=`
      -- Drop existing restrictive policies
      DROP POLICY IF EXISTS "Messages are viewable by everyone" ON messages;
      DROP POLICY IF EXISTS "Only authenticated users can create messages" ON messages;
      
      -- Create permissive policies for demo
      CREATE POLICY "Allow demo message creation" ON messages
        FOR INSERT WITH CHECK (true);
        
      CREATE POLICY "Allow demo message reads" ON messages
        FOR SELECT USING (true);
    `,{error:i}=await l.rpc("exec_sql",{sql:t});return i?console.error("Messages RLS policy error:",i):console.log("✅ Messages RLS policies updated"),u.NextResponse.json({success:!0,message:"RLS policies updated for demo deployment",timestamp:new Date().toISOString(),policies_updated:["users","rooms","messages"]})}catch(e){return console.error("RLS Policy Fix Error:",e),u.NextResponse.json({success:!1,error:"Failed to update RLS policies",message:e instanceof Error?e.message:"Unknown error"},{status:500})}}let n=new t.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/admin/fix-rls-policies/route",pathname:"/api/admin/fix-rls-policies",filename:"route",bundlePath:"app/api/admin/fix-rls-policies/route"},resolvedPagePath:"C:\\dev\\kamunity-final\\src\\app\\api\\admin\\fix-rls-policies\\route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:c,staticGenerationAsyncStorage:d,serverHooks:m}=n,O="/api/admin/fix-rls-policies/route";function R(){return(0,a.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:d})}}};var s=require("../../../../webpack-runtime.js");s.C(e);var r=e=>s(s.s=e),o=s.X(0,[8948,5972,2438],()=>r(97095));module.exports=o})();