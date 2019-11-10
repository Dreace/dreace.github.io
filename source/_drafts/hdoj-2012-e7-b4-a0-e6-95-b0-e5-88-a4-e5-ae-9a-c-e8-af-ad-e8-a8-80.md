---
title: HDOJ 2012 素数判定-C语言
tags:
  - ACM
  - C语言
  - HDOJ
typora-root-url: ../../source/
url: 228.html
id: 228
categories:
  - ACM
date: 2017-10-25 09:02:55
---

**Problem Description** 对于表达式n^2+n+41，当n在（x,y）范围内取整数值时（包括x,y）(-39<=x<y<=50)，判定该表达式的值是否都为素数。 **Input** 输入数据有多组，每组占一行，由两个整数x，y组成，当x=0,y=0时，表示输入结束，该行不做处理。 **Output** 对于每个给定范围内的取值，如果表达式的值都为素数，则输出"OK",否则请输出“Sorry”,每组输出占一行。 **Sample Input** 0 1 0 0 **Sample Output** OK

#include <stdio.h>
#include <math.h>
int main(){
	int a,b,i,x,y,flag,result;
	while((scanf("%d %d",&x,&y)!=EOF)&&(x!=0||y!=0)){
		flag = 1;
		for(i=x;i<=y;i++){
			result = pow(i,2) + i + 41;
			for(a=2;a<=(int)sqrt(result);a++){
				if(result%a==0){
					flag=0;
					break;
				}
			}
		}
		if(flag)
			printf("OK\\n");
		else
			printf("Sorry\\n");
	}
}