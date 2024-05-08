import EZAxios from '@/ezaxios';

export default {
    checkHash(data) {
        return EZAxios.get(`check-email-hash-for-unsubscribe?hash=${data}`);
    },
    setLandingPageAutomaticUpdateStatus(data) {
        return EZAxios.post(`set-landing-page-update-status-from-email`, data);
    }
};
