"use strict";(()=>{var e={};e.id=8561,e.ids=[8561],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},30616:(e,t,o)=>{o.r(t),o.d(t,{originalPathname:()=>u,patchFetch:()=>g,requestAsyncStorage:()=>p,routeModule:()=>l,serverHooks:()=>m,staticGenerationAsyncStorage:()=>c});var s={};o.r(s),o.d(s,{POST:()=>d});var i=o(49303),a=o(88716),r=o(60670),n=o(87070);async function d(e){try{let{roomData:t,userEmail:o}=await e.json(),s=`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your Kamunity Focus Room Specification</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
        .section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .section h2 { color: #1e293b; margin-top: 0; border-bottom: 2px solid #10b981; padding-bottom: 8px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat-card { background: white; border: 1px solid #d1d5db; border-radius: 6px; padding: 15px; text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #10b981; }
        .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
        .feature-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
        .feature-item { background: white; border-left: 4px solid #10b981; padding: 10px 15px; }
        .footer { text-align: center; padding: 30px; background: #f1f5f9; border-radius: 8px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏠 Your Focus Room Specification</h1>
        <p>Complete specification for: <strong>${t.name}</strong></p>
        <p>Generated on ${new Date().toLocaleDateString("en-AU",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
    </div>

    <div class="section">
        <h2>📋 Room Overview</h2>
        <p><strong>Name:</strong> ${t.name}</p>
        <p><strong>Purpose:</strong> ${t.purpose}</p>
        <p><strong>Target Audience:</strong> ${t.targetAudience}</p>
        <p><strong>Expected Members:</strong> ${t.expectedMembers}</p>
        <p><strong>Category:</strong> ${t.category}</p>
        <p><strong>Completeness:</strong> ${t.completeness}%</p>
    </div>

    <div class="section">
        <h2>🎯 Expected Outcomes</h2>
        <ul>
          ${t.expectedOutcomes?.map(e=>`<li>${e}</li>`).join("")||"<li>No specific outcomes defined</li>"}
        </ul>
    </div>

    <div class="section">
        <h2>🛠️ Tools & Features</h2>
        <div class="feature-list">
          ${t.tools?.map(e=>`<div class="feature-item"><strong>${e}</strong></div>`).join("")||'<div class="feature-item">Standard collaboration tools</div>'}
        </div>
    </div>

    <div class="section">
        <h2>📊 Current Room Statistics</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${t.stats?.activeMembers||12}</div>
                <div class="stat-label">Active Members</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${t.stats?.messages||156}</div>
                <div class="stat-label">Messages</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${t.stats?.engagement||78}%</div>
                <div class="stat-label">Engagement</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${t.stats?.impactScore||450}</div>
                <div class="stat-label">Impact Score</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>🏷️ Room Tags</h2>
        <p>${t.tags?.join(", ")||"No tags specified"}</p>
    </div>

    <div class="section">
        <h2>📝 Implementation Details</h2>
        <p><strong>Time Commitment:</strong> ${t.timeCommitment||"Flexible"}</p>
        <p><strong>Skills Required:</strong> ${t.skillsRequired||"None specified"}</p>
        <p><strong>Privacy Level:</strong> ${t.privacyLevel||"Standard"}</p>
    </div>

    <div class="footer">
        <h3>🚀 Next Steps</h3>
        <p>Your room has been saved to the Kamunity Room Hub where you can:</p>
        <ul style="text-align: left; display: inline-block;">
            <li>View and interact with your saved room</li>
            <li>Share the room with potential members</li>
            <li>Generate additional rooms for different purposes</li>
            <li>Explore other community rooms for inspiration</li>
        </ul>
        <p><strong>Visit your Room Hub:</strong> <a href="https://kamunitydemo.org/rooms" style="color: #10b981;">kamunitydemo.org/rooms</a></p>
        <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
            This email was generated automatically from your Kamunity Focus Room Generator session.
        </p>
    </div>
</body>
</html>
    `;if(!(await fetch(`${process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"}/api/demo/spec-email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userEmail:o,subject:`🏠 Your Kamunity Focus Room: "${t.name}" - Complete Specification`,htmlContent:s,roomName:t.name,isRoomSpec:!0})})).ok)throw Error("Failed to send room specification email");return n.NextResponse.json({success:!0,message:"Room specification email sent successfully",roomId:t.id})}catch(e){return console.error("Error in room-spec-email API:",e),n.NextResponse.json({success:!1,error:"Failed to send room specification email",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}let l=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/demo/room-spec-email/route",pathname:"/api/demo/room-spec-email",filename:"route",bundlePath:"app/api/demo/room-spec-email/route"},resolvedPagePath:"C:\\dev\\kamunity-final\\src\\app\\api\\demo\\room-spec-email\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:p,staticGenerationAsyncStorage:c,serverHooks:m}=l,u="/api/demo/room-spec-email/route";function g(){return(0,r.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:c})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),s=t.X(0,[8948,5972],()=>o(30616));module.exports=s})();