import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
test("2. X로 닫은 탭의 알람도 목록에서 제외한다",async({sharing:{owner,guest,id}})=>{
 const record=(await(await guest.request.get("/api/groups")).json()).groups.find((g:{id:string})=>g.id===id);const tab=record.data.tabs[0];
 const response=await guest.request.post("/api/groups/update",{data:{id,baseRevision:record.revision,data:{...record.data,tabs:[{...tab,open:false,title:"Hidden editor tab",content:"Hidden editor tab"}]}}});expect(response.ok()).toBe(true);
 const {notifications}=await(await owner.request.get("/api/groups/notifications")).json();expect(notifications.some((n:{tabId:string})=>n.tabId===tab.id)).toBe(false);
});
