import { X } from "lucide-react";
import { useEffect } from "react"
import { useModalContext } from "../context/context";
import PDFViewer from "./PDFViewer";
type DocumentModalProps = {
  isOpen: boolean,
  setOpen: (value: boolean) => void,
  data: {
    response: string,
    page: number,
    score: number,
    question: string,
    document_key: string,
  }
};

// type DocumentCardProps = Pick<DocumentModalProps, "data">;
type DocumentCardProps = Omit<DocumentModalProps["data"], "score">


const DocumentModal = ({ setOpen, data: { response, document_key, page, question } }: DocumentModalProps) => {
  
  const { pageCitationNumber, setPageCitationNumber , fileContent } = useModalContext();
  const handleCitationButtonClick = (citationNumber: number) => {
    setPageCitationNumber(citationNumber);
  };
  const highlights = [
    {
      pageIndex: 6,
      height: 100,
      width: 100,
      left: 0,
      top: 0,
    },
  ]
  useEffect(() => {
    console.log('CITATION RE-RENDERING !z');
  }, [])
  return (
    <>
      <div className={`fixed backdrop-blur-sm bg-neutral-200/5 inset-0 flex items-center justify-center w-full h-full max-h-screen z-40 py-4 lg:py-6 `}>
        <div className='max-w-7xl w-full h-full max-h-screen  z-40 rounded-2xl border shadow  bg-white flex justify-between'>
          <div className="w-2/3 h-full overflow-y-auto ">
            <PDFViewer
              fileUrl={"https://res.cloudinary.com/dmr6cs1hx/image/upload/v1722856440/osactqlgvzsblqiqgt7k.pdf"}
              pageNumber={pageCitationNumber}
              highlights={highlights}
            />
            {/* <PDFViewer
              fileUrl={"https://res.cloudinary.com/dmr6cs1hx/image/upload/v1722856440/osactqlgvzsblqiqgt7k.pdf"}
              pageNumber={pageCitationNumber}
              highlights={highlights}
            /> */}


          </div>
          <div className="w-1/3 bg-neutral-100 flex flex-col justify-between rounded-tr-2xl rounded-br-2xl">
            {/* <button onClick={() => setPage((prev) => prev + 1)}>change page</button> */}
            <div className="p-4 w-full flex justify-end ">
              <div className="cursor-pointer transition-all hover:bg-neutral-200 rounded-lg p-1">
                <X onClick={() => setOpen(false)} />
              </div>
            </div>
            {/* h-full max-h-[270px] */}
            <div className="h-full w-full flex flex-col items-center justify-center p-4 overflow-auto max-h-screen">
              <div className="w-full h-fit rounded-2xl border p-4 bg-white overflow-auto">
                <div className="flex h-fit ">
                  <div className="px-5 py-3 border bg-white rounded-lg w-fit h-fit">
                    <span className="font-bold text-reddish text-xl">Q</span>
                  </div>
                  <div className="px-2 font-semibold text-xl flex flex-col justify-center items-center capitalize">
                    <p>{question}</p>
                  </div>
                </div>
                <div className="h-fit ">
                  <div className="py-4 flex flex-col gap-3">
                    <DocumentCard
                      question={question}
                      response={response}
                      document_key={document_key}
                      page={page}
                      onCitationButtonClick={handleCitationButtonClick}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DocumentModal



export const DocumentCard = ({ page, response, question, onCitationButtonClick }: DocumentCardProps & { onCitationButtonClick: (citationNumber: number) => void }) => {
  console.log('question', question);
  return (
    <>
      <div className="border rounded-xl p-2 bg-white">
        <div className="flex justify-between p-2">
          <p className="p-2 text-subTextGrey select-all">{response}</p>
          <div className="pt-1 h-fit">
            <CitationButton citationNumber={page} onCitationButtonClick={onCitationButtonClick} />
          </div>
        </div>
      </div>
    </>
  )
}

export const CitationButton = ({ citationNumber = 1, onCitationButtonClick }: { citationNumber: number, onCitationButtonClick: (citationNumber: number) => void }) => {
  return (
    <>
      <span onClick={() => onCitationButtonClick(citationNumber)} className="text-orange-500 bg-orange-100 rounded border border-orange-500 py-1 px-3 text-sm font-semibold cursor-pointer hover:bg-orange-300 hover:text-black">❛❛{citationNumber}</span>
    </>
  )
}


{/* {
              fileContent ? (
                <iframe src={`${fileContent}#page=${pageCitationNumber}`}
                  className="w-full h-full rounded-tl-2xl rounded-bl-2xl"
                />
                // <iframe src={`http://res.cloudinary.com/dmr6cs1hx/image/upload/v1722534952/vg6gnmkxusxrl6n2esyx.pdf#page=${pageCitationNumber}`}
                //   className="w-full h-full rounded-tl-2xl rounded-bl-2xl"
                // />
              ) : (<div className="w-full h-full flex items-center justify-center">
                <div className="py-2 px-4 border-2 border-reddish rounded-lg text-reddish text-xs cursor-not-allowed">
                  <p>No PDF Found , Please try again later.</p>
                </div>
              </div>)
            } */}
