import { getExcelDownloadAPI } from '@/api/getResult';
import Alert from '@/components/common/Alert';
import Loading from '@/components/common/Loading';
import { ListData } from '@/types/answerData';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ResponseProps {
  title: string;
  list: ListData;
}

interface Row {
  id: number;
  날짜: string;
  [key: string]: string | number;
}

function Response({ title, list }: ResponseProps) {
  const [searchParams] = useSearchParams();
  const surveyId = Number(searchParams.get('id'));

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const columns: GridColDef[] = [{ field: '날짜', headerName: '날짜', width: 200 }];

  list.head.forEach((question, index) => {
    columns.push({
      field: `Q${index + 1}`,
      headerName: `Q${index + 1}. ${question}`,
      width: 150,
    });
  });

  const rows = list.rows.map((row, index) => {
    const newRow: Row = { id: index + 1, 날짜: row.createdAt };

    row.responses.forEach((response, i) => {
      newRow[`Q${i + 1}`] = response;
    });

    return newRow;
  });

  const handleDownload = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await getExcelDownloadAPI(surveyId);

      // 엓셀 파일 다운로드
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.xlsx`);
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 60000);
      link.remove();
      console.log(response);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <button
        type="button"
        className="absolute top-[8.25rem] right-[7.5rem] w-[6.25rem] h-9 leading-4 bg-darkPurple rounded-[0.625rem] text-base text-white cltext-base focus:outline-none hover:bg-[#403B82] transition duration-300 ease-in-out"
        onClick={handleDownload}
      >
        저장하기
      </button>
      {error && <Alert type="error" message="엑셀 파일 다운로드에 실패했습니다." buttonText="확인" />}
      <div className="max-w-[52.5rem] max-h-[41rem] pt-4">
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
        />
      </div>
    </div>
  );
}

export default Response;
