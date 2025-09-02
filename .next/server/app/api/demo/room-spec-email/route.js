"use strict";(()=>{var e={};e.id=8561,e.ids=[8561],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},37834:(e,o,t)=>{t.r(o),t.d(o,{originalPathname:()=>u,patchFetch:()=>x,requestAsyncStorage:()=>l,routeModule:()=>m,serverHooks:()=>g,staticGenerationAsyncStorage:()=>c});var r={};t.r(r),t.d(r,{POST:()=>d});var a=t(49303),i=t(88716),n=t(60670),s=t(87070),p=t(76743);async function d(e){try{console.log("\uD83D\uDD25 Room spec email API called - Entry point reached");let o=await e.json();console.log("\uD83D\uDCCB Raw room spec email request body:",{hasData:!!o,keys:Object.keys(o||{})});let{roomData:t,userEmail:r}=o;if(!r||!t?.name)return s.NextResponse.json({error:"Missing required fields: userEmail and roomData.name"},{status:400});console.log("\uD83D\uDCE7 Sending room save notification to user...");let a={to:r,subject:`Kamunity Room Saved - ${t.name}`,html:`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #8b5cf6; padding-bottom: 20px;">
          <h1 style="color: #8b5cf6; margin: 0; font-size: 28px;">Room Saved Successfully! 💾</h1>
          <p style="color: #64748b; font-size: 16px; margin: 10px 0 0 0;">Your generated room has been saved to your collection</p>
        </div>

        <!-- Room Summary -->
        <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #8b5cf6;">
          <h2 style="color: #6b21a8; margin: 0 0 15px 0; font-size: 20px;">${t.title||t.name}</h2>
          <p style="color: #7c3aed; margin: 0 0 15px 0; line-height: 1.6;">
            ${t.description||t.purpose||"Your custom community room"}
          </p>
          
          <div style="color: #6b21a8; font-size: 14px;">
            ${t.category?`<p style="margin: 5px 0;"><strong>Category:</strong> ${t.category}</p>`:""}
            ${t.engagement?`<p style="margin: 5px 0;"><strong>Engagement:</strong> ${t.engagement}%</p>`:""}
            ${t.tags?`<p style="margin: 5px 0;"><strong>Focus Areas:</strong> ${t.tags.join(", ")}</p>`:""}
          </div>
        </div>

        <!-- Access Information -->
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 25px;">
          <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 18px;">Access Your Saved Room</h3>
          <p style="color: #047857; margin: 0 0 15px 0; line-height: 1.5;">
            Your room has been saved to your personal collection. You can access it anytime from your saved rooms page.
          </p>
          <a href="https://kamunitydemo.org/rooms" style="display: inline-block; background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            View Saved Rooms
          </a>
        </div>

        <!-- What's Next -->
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">Ready to Make It Real?</h3>
          <p style="color: #d97706; margin: 0 0 15px 0; line-height: 1.5;">
            This room specification can be turned into a real community space. Interested in bringing your vision to life?
          </p>
          <a href="https://kamunity.org/contact" style="display: inline-block; background: #d97706; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Start Conversation
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">
            Questions about your room? Reply to this email anytime.<br>
            <strong>Building community, one room at a time.</strong>
          </p>
        </div>
      </div>
    </div>
  `,from:"Kamunity Demo <demo@kamunity.org>"},i=await (0,p.Px)(a);console.log("\uD83D\uDCE7 Sending room save notification to admin...");let n={to:"mike@kamunityconsulting.com",subject:`New Room Saved in Demo - ${t.name}`,html:`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; border-radius: 8px; padding: 25px; border-left: 4px solid #8b5cf6;">
        
        <h2 style="color: #8b5cf6; margin: 0 0 20px 0;">New Room Saved in Demo</h2>
        <p style="color: #64748b; margin: 0 0 25px 0;"><strong>Saved:</strong> ${new Date().toLocaleString()}</p>
        
        <!-- User Info -->
        <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #334155; margin: 0 0 10px 0; font-size: 16px;">User Information</h3>
          <p style="color: #475569; margin: 0;"><strong>Email:</strong> ${r}</p>
          <p style="color: #475569; margin: 5px 0 0 0;"><strong>Action:</strong> Saved Generated Room</p>
        </div>

        <!-- Room Details -->
        <div style="background: #faf5ff; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #334155; margin: 0 0 10px 0; font-size: 16px;">Saved Room Details</h3>
          <p style="color: #7c3aed; margin: 0 0 10px 0;"><strong>Title:</strong> ${t.title||t.name}</p>
          <p style="color: #7c3aed; margin: 0;"><strong>Description:</strong> ${t.description||t.purpose}</p>
          ${t.category?`<p style="color: #7c3aed; margin: 5px 0 0 0;"><strong>Category:</strong> ${t.category}</p>`:""}
          ${t.engagement?`<p style="color: #7c3aed; margin: 5px 0 0 0;"><strong>Engagement:</strong> ${t.engagement}%</p>`:""}
        </div>

        <!-- Full Room Data -->
        ${t.roomData?`
        <div style="background: #f1f5f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #334155; margin: 0 0 10px 0; font-size: 16px;">Complete Room Data</h3>
          <div style="color: #475569; font-size: 12px; line-height: 1.4; white-space: pre-wrap; max-height: 200px; overflow-y: auto; background: #f8fafc; padding: 10px; border-radius: 4px;">
            ${JSON.stringify(t.roomData,null,2)}
          </div>
        </div>
        `:""}

        <!-- Lead Opportunity -->
        <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-top: 20px;">
          <p style="color: #92400e; margin: 0; font-weight: bold;">
            🎯 Lead Opportunity: User engaged enough to save a room specification. Consider follow-up for implementation.
          </p>
        </div>
      </div>
    </div>
  `,from:"Kamunity Demo <demo@kamunity.org>"},d=await (0,p.Px)(n);return console.log("\uD83D\uDCE7 Room Save Email Results:",{to:r,room:t.name,user:{success:i.success,method:i.method},admin:{success:d.success,method:d.method},timestamp:new Date().toISOString()}),s.NextResponse.json({success:!0,message:"Room specification emailed successfully",emailStatus:{user:i,admin:d},debug:{timestamp:new Date().toISOString(),resendConfigured:!!process.env.RESEND_API_KEY}})}catch(e){return console.error("Error in room-spec-email API:",e),s.NextResponse.json({success:!1,error:"Failed to send room specification email",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}let m=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/demo/room-spec-email/route",pathname:"/api/demo/room-spec-email",filename:"route",bundlePath:"app/api/demo/room-spec-email/route"},resolvedPagePath:"C:\\dev\\kamunity-final\\src\\app\\api\\demo\\room-spec-email\\route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:l,staticGenerationAsyncStorage:c,serverHooks:g}=m,u="/api/demo/room-spec-email/route";function x(){return(0,n.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:c})}}};var o=require("../../../../webpack-runtime.js");o.C(e);var t=e=>o(o.s=e),r=o.X(0,[8948,5972,6743],()=>t(37834));module.exports=r})();