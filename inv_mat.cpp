#include <stdlib.h>
#include <iostream>
#include <stdio.h>
#include <vector>

using namespace std;

double matrix[10][10*2];    // 參數化的矩陣
 
bool gauss_jordan_elimination()
{
    // 填好參數化的部分
    for (int i=0; i<10; ++i)
        {
        matrix[0][i] = 1;
        matrix[i][0] = 1;
        }
    for (int i=1; i<10; ++i)
        for (int j=1; j<10; ++j)
            matrix[i][j] = matrix[i-1][j] + matrix[i][j-1];

    for (int i=0; i<10; ++i)
        for (int j=0; j<10; ++j)
            matrix[i][10+j] = 0;
 
    for (int i=0; i<10; ++i)
        matrix[i][10+i] = 1;
    
    int i = 0;
    int j = 0;
    while(i < 10)
        {   
        j = 0;
        while(j < 20)
            {
            cout << matrix[i][j] << ", ";
            ++j;
            }
        cout << endl;
        ++i;
        }

    cout << endl;
    // 開始進行高斯喬登消去法
    // 內容幾乎與高斯消去法相同
    for (int i=0; i<10; ++i)
    {
        if (matrix[i][i] == 0)
            {
            for (int j=i+1; j<10; ++j)
                {
                if (matrix[j][i] != 0)
                    {
                    for (int k=i; k<10*2; ++k)
                        {
                        swap(matrix[i][k], matrix[j][k]);
                        }
                    break;
                    }   
                }
            }
 
        // 反矩陣不存在。
        if (matrix[i][i] == 0) return false;
 
        double t = matrix[i][i];
        for (int k=i; k<10*2; ++k)
            matrix[i][k] /= t;
 
        // 消去時，所有的row都消去。
        for (int j=0; j<10; ++j)
            if (i != j && matrix[j][i] != 0)
            {
                double t = matrix[j][i];
                for (int k=i; k<10*2; ++k)
                    matrix[j][k] -= matrix[i][k] * t;
            }
    }

    return true;
}

void print_vec_2D_vec(vector< vector<double> > &v)
    {
    for(int i = 0; i < v.size(); ++i)
        {   
        for(int j = 0; j < v[i].size(); ++j)
            {   
            //printf("%lf, ", v[i][j]);
            cout << v[i][j] << ", ";
            }
        printf("\n");
        }
    printf("\n");
    return;
    }

bool inv_matrix(vector< vector<double> > &arr, vector< vector<double> > &arr_inv)
    {
    //cout << "a" << endl;
    //cout << length << endl; 
    long long int length = arr.size();
    vector< vector<double> > temp_arr;
    vector<double> temp_row(length*2, 0);
    //cout << "a" << endl;
    long long int i, j, k;
    for(i = length; --i >= 0;)
        {
        temp_arr.push_back( temp_row );
        }
    //cout << "zz" << endl;
    
    for(i = length; --i >= 0;)
        {
        for(j = length; --j >= 0;)
            {   
            temp_arr[i][j] = arr[i][j];
            }
        }

    for (i = length; --i >= 0;)
        {
        temp_arr[i][i+length] = 1;
        }
    //cout << "b" << endl; 
    /*while(i < 10)
        {   
        j = 0;
        while(j < 20)
            {
            cout << matrix[i][j] << ", ";
            ++j;
            }
        cout << endl;
        ++i;
        }

    cout << endl;*/
    for(i = 0; i < length; ++i)
        {
        if(temp_arr[i][i] == 0)
            {
            for (j = i + 1; j < length; ++j)
                {
                if(temp_arr[j][i] != 0)
                    {
                    for(k = i; k < length * 2; ++k)
                        {
                        swap(temp_arr[i][k], temp_arr[j][k]);
                        }
                    break;
                    }
                }
            }

        if (temp_arr[i][i] == 0) return false;
 
        double temp1 = temp_arr[i][i];
        for(k = i; k < length*2; ++k)
            {
            temp_arr[i][k] /= temp1;
            }
        double temp2;
        for(j = 0; j < length; ++j)
            if(i != j && temp_arr[j][i] != 0)
                {
                temp2 = temp_arr[j][i];
                for (k = i; k < length*2; ++k)
                    {
                    temp_arr[j][k] -= temp_arr[i][k] * temp2;
                    }
                }
        }

    vector<double> vec_temp(length);
    for(i = 0; i < length; ++i)
        {   
        arr_inv.push_back( vec_temp );
        for(j = 0; j < length; ++j)
            {
        //cout << arr_inv[i][j] << ", " << temp_arr[i][j+length] << endl;   
            arr_inv[i][j] = temp_arr[i][j+length];
            }
        }
    cout << "INIT:" << endl;
    print_vec_2D_vec(arr);
    cout << "INV: " << endl;
    print_vec_2D_vec(arr_inv);
    return true;
    }

int main()
    {
    if(gauss_jordan_elimination() == true)
        cout << "Inv matrix:" << endl; 
    int i = 0;
    int j = 0;
    while(i < 10)
        {   
        j = 0;
        while(j < 20)
            {
            cout << matrix[i][j] << ", ";
            ++j;
            }
        cout << endl;
        ++i;
        }

    vector< vector<double> > test;
    vector< vector<double> > test_inv;

    vector<double> row(5,0);
    i = 0;
    while(i < 5)
        {   
        test.push_back( row );
        //test_inv.push_back( row );
        ++i;
        }
    /*i  = 0;
    while(i < 10)
        {   
        test[0][i] = 1;
        test[i][0] = 1;
        ++i;
        }
    i = 1;
    while(i < 10)
        {   
        j = 1;
        while(j < 10)
            {   
            test[i][j] = test[i-1][j] + test[i][j-1];
            ++j;
            }
        ++i;
        }*/
    i = 0;
    while(i < 5)
        {   
        j = 0;
        while(j < 5)
            {   
            cin >> test[i][j];
            ++j;
            }
        ++i;
        }
    inv_matrix(test, test_inv);
    return 0;
    }