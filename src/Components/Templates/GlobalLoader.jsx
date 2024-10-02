import React from 'react';

const GlobalLoader = () => {
    const loaderStyle = {
        width: '70px',
        height: '70px',
        background: '#ffa600',
        borderRadius: '50px',
        WebkitMask: `
      radial-gradient(circle 31px at 50% calc(100% + 13px),#000 95%,#0000) top 4px left 50%,
      radial-gradient(circle 31px,#000 95%,#0000) center,
      radial-gradient(circle 31px at 50% -13px,#000 95%,#0000) bottom 4px left 50%,
      linear-gradient(#000 0 0)
    `,
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        WebkitMaskRepeat: 'no-repeat',
        animation: 'cu10 1.5s infinite',
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="custom-loader" style={loaderStyle}></div>
            <style>{`
        @keyframes cu10 {
          0% { -webkit-mask-size: 0 18px,0 18px,0 18px,auto }
          16.67% { -webkit-mask-size: 100% 18px,0 18px,0 18px,auto }
          33.33% { -webkit-mask-size: 100% 18px,100% 18px,0 18px,auto }
          50% { -webkit-mask-size: 100% 18px,100% 18px,100% 18px,auto }
          66.67% { -webkit-mask-size: 0 18px,100% 18px,100% 18px,auto }
          83.33% { -webkit-mask-size: 0 18px,0 18px,100% 18px,auto }
          100% { -webkit-mask-size: 0 18px,0 18px,0 18px,auto }
        }
      `}</style>
        </div>
    );
};

export default GlobalLoader;