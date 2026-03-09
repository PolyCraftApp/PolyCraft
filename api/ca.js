import { get } from '@vercel/edge-config'

export default async function getCA(req, res) {
    try {
        const ca = await get('ca');
        if (!ca) {
            return res.status(404).json({ success: false, error: 'CA not found' });
        }
        res.status(200).json({ success: true, ca: ca });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to get CA' });
    }
}