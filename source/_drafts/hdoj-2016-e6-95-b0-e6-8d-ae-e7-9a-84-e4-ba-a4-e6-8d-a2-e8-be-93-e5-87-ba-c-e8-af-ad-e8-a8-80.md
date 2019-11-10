---
title: HDOJ 2016 数据的交换输出-C语言
tags:
  - ACM
  - C语言
  - HDOJ
typora-root-url: ../../source/
url: 221.html
id: 221
categories:
  - ACM
date: 2017-10-24 22:20:46
---

**Problem Description** 输入n(n<100)个数，找出其中最小的数，将它与最前面的数交换后输出这些数。 **Input** 输入数据有多组，每组占一行，每行的开始是一个整数n，表示这个测试实例的数值的个数，跟着就是n个整数。n=0表示输入的结束，不做处理。 **Output** 对于每组输入数据，输出交换后的数列，每组输出占一行。 **Sample Input** 4 2 1 3 4 5 5 4 3 2 1 0 **Sample Output** 1 2 3 4 1 4 3 2 5

#include <stdio.h>

void exchange(int \*a,int \*b){
	int temp;
	temp=*a;
	\*a=\*b;
	*b=temp;
}

int main(){
	int n,m,i,sum,flag,numbers\[100\];
	while((scanf("%d",&n)!=EOF)&&(n!=0)){
		flag=0;
		scanf("%d",&numbers\[0\]);
		for(i=1;i<n;i++){
			scanf("%d",&numbers\[i\]);
			if(numbers\[i\]<numbers\[flag\])
				flag=i;
		}
		exchange(&numbers\[flag\],&numbers\[0\]);
		for(i=0;i<n-1;i++)
			printf("%d ",numbers\[i\]);
		printf("%d\\n",numbers\[n-1\]);
	}
}