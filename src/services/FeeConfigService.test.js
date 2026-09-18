import service from './FeeConfigService';
import seed from '../data/fee-config.json';
const response = (status, data) => ({status,ok:status === 200,json:async()=>data});
afterEach(()=>jest.restoreAllMocks());
it('fetches a selected draft without committing stale requests to calculator state',async()=>{
 const before=service.config;
 global.fetch=jest.fn().mockResolvedValue(response(200,{config:seed,maintenance:true,preview:{id:'draft one'}}));
 const data=await service.loadPublished('draft one');
 expect(fetch.mock.calls[0][0]).toContain('action=preview&draftId=draft%20one');
 expect(data.preview.id).toBe('draft one');
 expect(service.config).toBe(before);
});
it.each([403,404])('returns published fees when preview becomes unavailable (%s)',async(status)=>{
 global.fetch=jest.fn().mockResolvedValueOnce(response(status,{})).mockResolvedValueOnce(response(200,{config:seed,maintenance:false}));
 const data=await service.loadPublished('draft');
 expect(fetch.mock.calls[1][0]).toBe('/api/fees?action=live');
 expect(data.maintenance).toBe(false);
 expect(data.preview).toBeUndefined();
});
it('shows maintenance instead of draft prices after the admin session expires',async()=>{
 global.fetch=jest.fn().mockResolvedValueOnce(response(401,{})).mockResolvedValueOnce(response(503,{maintenance:true}));
 await expect(service.loadPublished('draft')).rejects.toMatchObject({maintenance:true});
});
