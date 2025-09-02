"use strict";(()=>{var e={};e.id=2436,e.ids=[2436],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},86619:(e,t,o)=>{o.r(t),o.d(t,{originalPathname:()=>x,patchFetch:()=>h,requestAsyncStorage:()=>m,routeModule:()=>p,serverHooks:()=>y,staticGenerationAsyncStorage:()=>c});var n={};o.r(n),o.d(n,{POST:()=>l});var s=o(49303),i=o(88716),r=o(60670),a=o(87070),d=o(76743);async function l(e){try{console.log("\uD83D\uDD25 Survey API called - Entry point reached");let t=await e.json();console.log("\uD83D\uDCCB Raw request body:",{hasData:!!t,keys:Object.keys(t||{})});let{surveyData:n,analyticsData:s,timestamp:i}=t;console.log("\uD83D\uDCCB Survey data received:",{hasEmail:!!n?.email,experience:n?.experience,emailAddress:n?.email?n.email.substring(0,3)+"***":"none"}),console.log("\uD83D\uDCE7 Sending admin notification...");let r=await u(n,s,i);console.log("✅ Admin notification sent");let d=null;if(n?.email)console.log("\uD83D\uDCE7 Sending user thank you email..."),d=await g(n,s,i),console.log("✅ User thank you email sent");else{try{let{HybridStorage:e}=await o.e(256).then(o.bind(o,60256));await e.saveSurvey(n,s)}catch(e){console.warn("⚠️ Failed to save survey to database:",e)}return console.log("\uD83D\uDCE7 Survey submission completed successfully"),a.NextResponse.json({success:!0,message:"Survey submitted successfully",emailStatus:"sent"})}return a.NextResponse.json({success:!0,message:"Survey submitted successfully",emailStatus:{admin:r,user:d},debug:{timestamp:new Date().toISOString(),resendConfigured:!!process.env.RESEND_API_KEY}})}catch(e){return console.error("\uD83D\uDCA5 Survey submission error:",e),a.NextResponse.json({success:!1,message:"Failed to submit survey"},{status:500})}}async function u(e,t,o){console.log("\uD83D\uDCE7 Starting admin notification email with Resend...");let n={to:"mike@kamunityconsulting.com",subject:`New Kamunity Demo Survey - ${new Date(o).toLocaleDateString()}`,html:`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; border-radius: 8px; padding: 25px; border-left: 4px solid #0ea5e9;">
        
        <h2 style="color: #0ea5e9; margin: 0 0 20px 0;">New Kamunity Demo Feedback</h2>
        <p style="color: #64748b; margin: 0 0 25px 0;"><strong>Submitted:</strong> ${new Date(o).toLocaleString()}</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #334155; margin: 0 0 15px 0;">Survey Responses</h3>
          <ul style="color: #475569; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li><strong>Experience:</strong> ${e.experience}</li>
            <li><strong>Most Interesting:</strong> ${e.mostInteresting}</li>
            <li><strong>Would Use Again:</strong> ${e.wouldUseAgain}</li>
            <li><strong>Suggestions:</strong> ${e.suggestions||"None provided"}</li>
            <li><strong>Feature Ideas:</strong> ${e.additionalFeatures||"None provided"}</li>
            <li><strong>Room Ideas:</strong> ${e.roomIdeas||"None provided"}</li>
            <li><strong>Email:</strong> ${e.email||"Not provided"}</li>
          </ul>
        </div>

        <div style="background: #f1f5f9; padding: 20px; border-radius: 6px;">
          <h3 style="color: #334155; margin: 0 0 15px 0;">Analytics Summary</h3>
          <ul style="color: #475569; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li><strong>Session ID:</strong> ${t.sessionId}</li>
            <li><strong>User ID:</strong> ${t.userId||"Anonymous"}</li>
            <li><strong>Engagement Level:</strong> ${t.engagementLevel}</li>
            <li><strong>Behavior Patterns:</strong> ${JSON.stringify(t.interests?.behaviorPatterns||{})}</li>
            <li><strong>Recommended Actions:</strong> ${t.recommendedActions?.join(", ")||"None"}</li>
          </ul>
        </div>
      </div>
    </div>
  `,from:"Kamunity Demo <demo@kamunity.org>"},s=await (0,d.Px)(n);return console.log("\uD83D\uDCE7 Admin notification result:",{success:s.success,method:s.method,messageId:s.messageId}),s}async function g(e,t,o){console.log("\uD83D\uDCE7 Starting user thank you email with Resend...");let n={to:e.email,subject:"Thank you for your Kamunity Demo feedback!",html:`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px;">
          <h1 style="color: #0ea5e9; margin: 0; font-size: 28px;">Thank You for Your Feedback! 🎉</h1>
          <p style="color: #64748b; font-size: 16px; margin: 10px 0 0 0;">Your insights help us build better communities together</p>
        </div>

        <!-- Feedback Summary -->
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #334155; margin: 0 0 15px 0; font-size: 20px;">Your Feedback Summary</h2>
          <div style="color: #475569; line-height: 1.6;">
            <p><strong>Experience:</strong> ${e.experience}</p>
            <p><strong>Most Interesting:</strong> ${e.mostInteresting}</p>
            <p><strong>Would Use Again:</strong> ${e.wouldUseAgain}</p>
            ${e.suggestions?`<p><strong>Suggestions:</strong> ${e.suggestions}</p>`:""}
            ${e.additionalFeatures?`<p><strong>Feature Ideas:</strong> ${e.additionalFeatures}</p>`:""}
            ${e.roomIdeas?`<p><strong>Room Ideas:</strong> ${e.roomIdeas}</p>`:""}
          </div>
        </div>

        <!-- What's Next -->
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 25px;">
          <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 18px;">What's Next?</h3>
          <p style="color: #047857; margin: 0; line-height: 1.5;">
            We're actively building Kamunity based on feedback like yours. Your insights are helping shape how communities connect and create change together.
          </p>
        </div>

        <!-- Call to Action -->
        <div style="text-align: center; margin-bottom: 25px;">
          <a href="https://kamunity.org" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px 10px 0;">
            Stay Connected
          </a>
          <a href="https://kamunitydemo.org" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px 10px 0;">
            Try Demo Again
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">
            Questions or ideas? Reply to this email anytime.<br>
            <strong>Building community, one conversation at a time.</strong>
          </p>
        </div>
      </div>
    </div>
  `,from:"Kamunity Demo <demo@kamunity.org>"},s=await (0,d.Px)(n);return console.log("\uD83D\uDCE7 User thank you result:",{success:s.success,method:s.method,messageId:s.messageId}),s}let p=new s.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/demo/survey/route",pathname:"/api/demo/survey",filename:"route",bundlePath:"app/api/demo/survey/route"},resolvedPagePath:"C:\\dev\\kamunity-final\\src\\app\\api\\demo\\survey\\route.ts",nextConfigOutput:"standalone",userland:n}),{requestAsyncStorage:m,staticGenerationAsyncStorage:c,serverHooks:y}=p,x="/api/demo/survey/route";function h(){return(0,r.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:c})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),n=t.X(0,[8948,5972,6743],()=>o(86619));module.exports=n})();