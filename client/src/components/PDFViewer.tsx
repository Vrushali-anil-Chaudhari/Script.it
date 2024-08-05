import { useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { highlightPlugin, Trigger, RenderHighlightsProps } from '@react-pdf-viewer/highlight';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

interface PDFViewerProps {
  fileUrl: string;
  pageNumber: number;
  highlights: {
    pageIndex: number;
    height: number;
    width: number;
    left: number;
    top: number;
  }[];
}

interface HighlightArea {
  pageIndex: number;
  top: number;
  left: number;
  width: number;
  height: number;
}

const PDFViewer = ({ fileUrl, pageNumber, highlights }: PDFViewerProps) => {
  const [highlightAreas, setHighlightAreas] = useState<HighlightArea[]>([]);

  const pagePluginInstance = pageNavigationPlugin();

  // Convert incoming highlights to the expected format
  useEffect(() => {
    const formattedHighlights = highlights.map(h => ({
      pageIndex: h.pageIndex,
      top: h.top,
      left: h.left,
      width: h.width,
      height: h.height
    }));
    setHighlightAreas(formattedHighlights);
  }, [highlights]);

  const renderHighlights = (props: RenderHighlightsProps) => (
    <div>
      {highlightAreas
        .filter((area) => area.pageIndex === props.pageIndex)
        .map((area, idx) => (
          <div
            key={idx}
            className="highlight-area"
            style={Object.assign(
              {},
              {
                background: '#ffdeb3de',
                opacity: 0.4,
              },
              props.getCssProperties(area, props.rotation)
            )}
          />
        ))}
    </div>
  );

  const highlightPluginInstance = highlightPlugin({
    renderHighlights,
    trigger: Trigger.None,
  });

  useEffect(() => {
    pagePluginInstance.jumpToPage(pageNumber);
  }, [pageNumber, pagePluginInstance]);

  return (
    <>
      <Worker workerUrl={"https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"}>
        <Viewer
          fileUrl={fileUrl}
          plugins={[pagePluginInstance, highlightPluginInstance]}
          initialPage={pageNumber - 1}
        />
      </Worker>
    </>
  );
};

export default PDFViewer;



// import { Worker, Viewer, SpecialZoomLevel, ScrollMode, Button, Position, Tooltip } from '@react-pdf-viewer/core';
// import React, { useState } from 'react';
// // import { GlobalWorkerOptions, version } from 'pdfjs-dist'
// // import { highlightPlugin, MessageIcon, RenderHighlightTargetProps } from '@react-pdf-viewer/highlight';
// import "@react-pdf-viewer/core/lib/styles/index.css"
// // import "@react-pdf-viewer/default-layout/lib/styles/index.css"
// // import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';


// interface PDFViewerProps {
//   fileUrl: string;
//   pageNumber: number
// }

// const PDFViewer = ({ fileUrl , pageNumber }: PDFViewerProps) => {
//   console.log('pageNumber value', pageNumber);
//   return (
//     <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`} >
//         <Viewer fileUrl={`${fileUrl}`}  initialPage={pageNumber - 1}/>
//     </Worker>
//   );
// };

// export default PDFViewer;
