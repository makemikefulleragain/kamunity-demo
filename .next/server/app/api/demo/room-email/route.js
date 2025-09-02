"use strict";(()=>{var e={};e.id=2253,e.ids=[2253],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},9197:(e,o,t)=>{t.r(o),t.d(o,{originalPathname:()=>l,patchFetch:()=>c,requestAsyncStorage:()=>u,routeModule:()=>m,serverHooks:()=>g,staticGenerationAsyncStorage:()=>d});var r={};t.r(r),t.d(r,{POST:()=>p});var s=t(49303),a=t(88716),n=t(60670),i=t(87070);async function p(e){try{let{to_email:o,user_email:t,room_name:r,room_purpose:s,room_features:a,rating:n,feedback:p,timestamp:m}=await e.json(),u=`
      <h2>Your Kamunity Room Details</h2>
      <p>Thank you for designing a room with us! Here are your room details:</p>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3><strong>Room Name:</strong> ${r}</h3>
        <p><strong>Purpose:</strong> ${s}</p>
        <p><strong>Features:</strong> ${a}</p>
        <p><strong>Your Rating:</strong> ${n}/5 stars</p>
        ${p?`<p><strong>Your Feedback:</strong> ${p}</p>`:""}
      </div>
      
      <p>We're creating this together! Your input helps us build better community spaces.</p>
      
      <p>
        <strong>Stay Connected:</strong><br>
        • Visit <a href="https://kamunity.org">kamunity.org</a> to stay in touch<br>
        • Try again at <a href="https://kamunitydemo.org">kamunitydemo.org</a> to provide more ideas
      </p>
      
      <p style="color: #6b7280; font-size: 14px;">
        Privacy Note: Your data won't be shared with third parties. 
        We use it only to improve the platform and may contact you about your room design.
      </p>
    `,d=`
      <h2>New Room Design Submission</h2>
      <p>A user has completed a room design and provided feedback:</p>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3><strong>Room Details:</strong></h3>
        <p><strong>Name:</strong> ${r}</p>
        <p><strong>Purpose:</strong> ${s}</p>
        <p><strong>Features:</strong> ${a}</p>
        <p><strong>User Email:</strong> ${t}</p>
        <p><strong>Rating:</strong> ${n}/5 stars</p>
        ${p?`<p><strong>User Feedback:</strong> ${p}</p>`:""}
        <p><strong>Timestamp:</strong> ${new Date(m).toLocaleString()}</p>
      </div>
      
      <p>Please review and follow up as needed.</p>
    `;return console.log("Room Email - User:",{to:o,subject:`Your Kamunity Room: ${r}`,content:u}),console.log("Room Email - Admin:",{to:"mike@kamunityconsulting.com",subject:`New Room Design: ${r} (${n}/5 stars)`,content:d}),console.log("Room email tracking:",{event:"room_details_emailed",room_name:r,rating:n,has_feedback:!!p,timestamp:m}),i.NextResponse.json({success:!0,message:"Room details emailed successfully"})}catch(e){return console.error("Room email error:",e),i.NextResponse.json({success:!1,error:"Failed to send email"},{status:500})}}let m=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/demo/room-email/route",pathname:"/api/demo/room-email",filename:"route",bundlePath:"app/api/demo/room-email/route"},resolvedPagePath:"C:\\dev\\kamunity-final\\src\\app\\api\\demo\\room-email\\route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:u,staticGenerationAsyncStorage:d,serverHooks:g}=m,l="/api/demo/room-email/route";function c(){return(0,n.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:d})}}};var o=require("../../../../webpack-runtime.js");o.C(e);var t=e=>o(o.s=e),r=o.X(0,[8948,5972],()=>t(9197));module.exports=r})();