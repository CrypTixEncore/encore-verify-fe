const useGtagEvent = (action, params ) => {
    window.gtag('event', action, params)
};

export default useGtagEvent;